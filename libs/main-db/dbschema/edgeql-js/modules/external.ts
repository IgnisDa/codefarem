import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export type $InviteAs = {
  Student: $.$expr_Literal<$InviteAs>;
  Teacher: $.$expr_Literal<$InviteAs>;
} & $.EnumType<"external::InviteAs", ["Student", "Teacher"]>;
const InviteAs: $InviteAs = $.makeType<$InviteAs>(_.spec, "3ad85873-77f1-11ed-a3df-ada2359526dd", _.syntax.literal);

export type $InviteLinkλShape = $.typeutil.flatten<_std.$Object_1cddb2f4773011ed977d63c742e2f33fλShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "expires_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
  "used_at": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, false>;
  "is_active": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "ia": $.PropertyDesc<$InviteAs, $.Cardinality.One, false, false, false, true>;
  "token": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
}>;
type $InviteLink = $.ObjectType<"external::InviteLink", $InviteLinkλShape, null>;
const $InviteLink = $.makeType<$InviteLink>(_.spec, "3ad86dd8-77f1-11ed-842a-e1a176aadad7", _.syntax.literal);

const InviteLink: $.$expr_PathNode<$.TypeSet<$InviteLink, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InviteLink, $.Cardinality.Many), null, true);



export { InviteAs, $InviteLink, InviteLink };

type __defaultExports = {
  "InviteAs": typeof InviteAs;
  "InviteLink": typeof InviteLink
};
const __defaultExports: __defaultExports = {
  "InviteAs": InviteAs,
  "InviteLink": InviteLink
};
export default __defaultExports;
