import * as edgedb from 'edgedb';
import e from '../dbschema/edgeql-js';
import { createUserInfo } from '../generators';

describe('Database behavior testing', () => {
  let client: edgedb.Client;

  beforeAll(() => {
    client = edgedb.createClient();
  });

  afterAll(async () => {
    await client.close();
  });

  it('Deleting a teacher removes them from their associated class without an error', async () => {
    for (let i = 0; i < 4; i+=1) {
      const teacherData = createUserInfo();
      await e
        .insert(e.users.Teacher, {
          profile: e.insert(e.users.UserProfile, teacherData.profile),
          auth: e.insert(e.users.UserAuth, teacherData.auth),
        })
        .run(client);
    }
    const { id } = await e
      .insert(e.learning.Class, {
        name: 'CPP',
        students: e.select(e.users.Student),
        teachers: e.select(e.users.Teacher),
      })
      .run(client);
    const classShape = e.shape(e.learning.Class, (c) => ({
      numTeachers: e.count(c.teachers),
      teachers: true,
      filter: e.op(c.id, '=', e.uuid(id)),
    }));
    let cppClass = (await e
      .select(e.learning.Class, (c) => classShape(c))
      .run(client))!;
    expect(cppClass.numTeachers).toBe(4);
    await e
      .delete(e.users.Teacher, (t) => ({
        filter: e.op(t.id, '=', e.uuid(cppClass.teachers[0].id)),
      }))
      .run(client);
    // eslint-disable-next-line require-atomic-updates
    cppClass = (await e
      .select(e.learning.Class, (c) => classShape(c))
      .run(client))!;
    expect(cppClass.numTeachers).toBe(3);
  });

  it('Deleting a class removes them from a teacher without an errors', async () => {
    const teacherData = createUserInfo();
    const { id } = await e
      .insert(e.users.Teacher, {
        profile: e.insert(e.users.UserProfile, teacherData.profile),
        auth: e.insert(e.users.UserAuth, teacherData.auth),
      })
      .run(client);
    // create 4 classes
    for (let i = 0; i < 4; i+=1) {
      await e
        .insert(e.learning.Class, {
          name: `CPP-#${i}`,
          teachers: e.select(e.users.Teacher, (t) => ({
            filter: e.op(t.id, '=', e.uuid(id)),
          })),
        })
        .run(client);
    }
    const teacherShape = e.shape(e.users.Teacher, (c) => ({
      numClasses: e.count(c.classes),
      classes: true,
      filter: e.op(c.id, '=', e.uuid(id)),
    }));
    let teacher = (await e
      .select(e.users.Teacher, (c) => teacherShape(c))
      .run(client))!;
    expect(teacher.numClasses).toBe(4);
    await e
      .delete(e.learning.Class, (c) => ({
        filter: e.op(c.id, '=', e.uuid(teacher.classes[0].id)),
      }))
      .run(client);
    // eslint-disable-next-line require-atomic-updates
    teacher = (await e
      .select(e.users.Teacher, (c) => teacherShape(c))
      .run(client))!;
    expect(teacher.numClasses).toBe(3);
  });
});
