import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _users from "./users";
export type $InviteLinkλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "expires_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
  "is_used": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "is_active": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "token": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "organization": $.LinkDesc<$Organization, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $InviteLink = $.ObjectType<"organizations::InviteLink", $InviteLinkλShape, null>;
const $InviteLink = $.makeType<$InviteLink>(_.spec, "49173ba6-73ad-11ed-8443-f9a83c4f2911", _.syntax.literal);

const InviteLink: $.$expr_PathNode<$.TypeSet<$InviteLink, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InviteLink, $.Cardinality.Many), null, true);

export type $OrganizationλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "members": $.LinkDesc<_users.$Teacher, $.Cardinality.Many, {
    "@since": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "<organization[is organizations::InviteLink]": $.LinkDesc<$InviteLink, $.Cardinality.Many, {}, false, false,  false, false>;
  "<organization": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Organization = $.ObjectType<"organizations::Organization", $OrganizationλShape, null>;
const $Organization = $.makeType<$Organization>(_.spec, "49157167-73ad-11ed-82f8-ff8631a095ec", _.syntax.literal);

const Organization: $.$expr_PathNode<$.TypeSet<$Organization, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Organization, $.Cardinality.Many), null, true);



export { $InviteLink, InviteLink, $Organization, Organization };

type __defaultExports = {
  "InviteLink": typeof InviteLink;
  "Organization": typeof Organization
};
const __defaultExports: __defaultExports = {
  "InviteLink": InviteLink,
  "Organization": Organization
};
export default __defaultExports;
