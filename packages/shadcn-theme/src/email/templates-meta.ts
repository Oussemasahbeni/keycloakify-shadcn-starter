/**
 * Email templates the editor can preview. The registry in `preview.tsx` is typed
 * as `Record<EmailTemplateId, …>`, so this list and that registry must stay in
 * sync — adding an id here without registering the template (or vice-versa) is a
 * compile error. Ids match the template filenames (and the Keycloak `.ftl` names).
 */

import type { KcEmailVars } from "keycloakify-emails/variables";

export type EmailTemplateId = KcEmailVars["emailId"] extends `${infer Id}.ftl` ? Id : never;

 export type EmailTemplate = {
    id: EmailTemplateId;
    label: string;
}

export const emailTemplates = [
   { id: "email-test" , label: "Email Test" },
   { id: "email-update-confirmation" , label: "Email Update Confirmation" },
   { id: "email-verification" , label: "Email Verification" },
   { id: "event-login_error" , label: "Event Login Error" },
   { id: "event-remove_credential" , label: "Event Remove Credential" },
   { id: "event-remove_totp" , label: "Event Remove TOTP" },
   { id: "event-update_credential" , label: "Event Update Credential" },
   { id: "event-update_password" , label: "Event Update Password" },
   { id: "event-update_totp" , label: "Event Update TOTP" },
   { id: "event-user_disabled_by_permanent_lockout" , label: "Event User Disabled by Permanent Lockout" },
   { id: "event-user_disabled_by_temporary_lockout" , label: "Event User Disabled by Temporary Lockout" },
   { id: "executeActions" , label: "Execute Actions" },
   { id: "identity-provider-link" , label: "Identity Provider Link" },
   { id: "org-invite" , label: "Organization Invite" },
   { id: "password-reset" , label: "Password Reset" },
   { id: "verifiable-credential-offer" , label: "Verifiable Credential Offer" },
   { id: "workflow-notification", label: "Workflow Notification" },
]  as const satisfies readonly EmailTemplate[];

export const emailTemplateIds = emailTemplates.map(template => template.id);
