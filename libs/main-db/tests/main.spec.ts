import * as edgedb from 'edgedb';

import e from '../dbschema/edgeql-js';
import { createUserInfo } from '../generators';

describe('Database behavior testing', () => {
  let client: edgedb.Client;

  beforeAll(async () => {
    client = edgedb.createClient();
  });

  afterAll(async () => {
    await client.close();
  });

  test('Deleting a teacher removes them from their associated class without an error', async () => {
    for (let i = 0; i < 4; i++) {
      const teacherData = createUserInfo();
      await e
        .insert(e.Teacher, {
          profile: e.insert(e.UserProfile, teacherData.profile),
          auth: e.insert(e.UserAuth, teacherData.auth),
        })
        .run(client);
    }
    const { id } = await e
      .insert(e.Class, {
        name: 'CPP',
        students: e.select(e.Student),
        teachers: e.select(e.Teacher),
      })
      .run(client);
    const classShape = e.shape(e.Class, (c) => ({
      numTeachers: e.count(c.teachers),
      teachers: true,
      filter: e.op(c.id, '=', e.uuid(id)),
    }));
    let cppClass = await e.select(e.Class, (c) => classShape(c)).run(client);
    expect(cppClass.numTeachers).toBe(4);
    await e
      .delete(e.Teacher, (t) => ({
        filter: e.op(t.id, '=', e.uuid(cppClass.teachers[0].id)),
      }))
      .run(client);
    cppClass = await e.select(e.Class, (c) => classShape(c)).run(client);
    expect(cppClass.numTeachers).toBe(3);
  });

  test('Deleting a class removes them from a teacher without an errors', async () => {
    const teacherData = createUserInfo();
    const { id } = await e
      .insert(e.Teacher, {
        profile: e.insert(e.UserProfile, teacherData.profile),
        auth: e.insert(e.UserAuth, teacherData.auth),
      })
      .run(client);
    // create 4 classes
    for (let i = 0; i < 4; i++) {
      await e
        .insert(e.Class, {
          name: `CPP-#${i}`,
          teachers: e.select(e.Teacher, (t) => ({
            filter: e.op(t.id, '=', e.uuid(id)),
          })),
        })
        .run(client);
    }
    const teacherShape = e.shape(e.Teacher, (c) => ({
      numClasses: e.count(c.classes),
      classes: true,
      filter: e.op(c.id, '=', e.uuid(id)),
    }));
    let teacher = await e.select(e.Teacher, (c) => teacherShape(c)).run(client);
    expect(teacher.numClasses).toBe(4);
    await e
      .delete(e.Class, (c) => ({
        filter: e.op(c.id, '=', e.uuid(teacher.classes[0].id)),
      }))
      .run(client);
    teacher = await e.select(e.Teacher, (c) => teacherShape(c)).run(client);
    expect(teacher.numClasses).toBe(3);
  });
});
