import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _users from "./users";
export type $InviteLinkλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "token": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "account_type": $.PropertyDesc<_users.$AccountType, $.Cardinality.One, false, false, false, true>;
  "email": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "expires_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
  "used_at": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, false>;
  "is_active": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
}>;
type $InviteLink = $.ObjectType<"external::InviteLink", $InviteLinkλShape, null>;
const $InviteLink = $.makeType<$InviteLink>(_.spec, "71e81111-85a2-11ed-a9f9-414a0e9a0287", _.syntax.literal);

const InviteLink: $.$expr_PathNode<$.TypeSet<$InviteLink, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InviteLink, $.Cardinality.Many), null, true);



export { $InviteLink, InviteLink };

type __defaultExports = {
  "InviteLink": typeof InviteLink
};
const __defaultExports: __defaultExports = {
  "InviteLink": InviteLink
};
export default __defaultExports;
