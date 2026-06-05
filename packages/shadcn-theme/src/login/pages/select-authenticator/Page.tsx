import { Button } from '#/components/ui/button';
import { useI18n } from '#/login/i18n';
import { useKcContext } from '#/login/KcContext';
import { ChevronRight, Fingerprint, Globe, KeyRound, Shield } from 'lucide-react';
import { FaKey } from 'react-icons/fa';
import { assert } from 'tsafe/assert';
import { Template } from '../../components/Template';

const getAuthenticatorIcon = (authSelection: { displayName: string; iconCssClass?: string }) => {
    const displayName = authSelection.displayName.toLowerCase();
    const iconClass = authSelection.iconCssClass?.toLowerCase() || '';

    if (
        displayName.includes('webauthn') ||
        displayName.includes('passwordless') ||
        iconClass.includes('webauthn') ||
        displayName.includes('passkey')
    ) {
        return <Fingerprint className="w-5 h-5" />;
    }

    if (
        displayName.includes('otp') ||
        displayName.includes('totp') ||
        displayName.includes('authenticator')
    ) {
        return <Shield className="w-5 h-5" />;
    }

    if (
        displayName.includes('identity-provider') ||
        displayName.includes('idp') ||
        displayName.includes('sso') ||
        iconClass.includes('identityprovider')
    ) {
        return <Globe className="w-5 h-5" />;
    }

    if (
        displayName.includes('password') ||
        displayName.includes('username') ||
        iconClass.includes('password')
    ) {
        return <KeyRound className="w-5 h-5" />;
    }

    return <FaKey className="w-5 h-5" />;
};

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === 'select-authenticator.ftl');

    const { url, auth } = kcContext;

    const { msg, advancedMsg } = useI18n();
    return (
        <Template displayInfo={false} headerNode={msg('loginChooseAuthenticator')}>
            <form
                id="kc-select-credential-form"
                className="flex flex-col gap-3"
                action={url.loginAction}
                method="post"
            >
                <div className="flex flex-col gap-2">
                    {auth.authenticationSelections.map((authenticationSelection, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            className="w-full h-auto p-3 flex items-center justify-between text-start hover:bg-accent"
                            type="submit"
                            name="authenticationExecution"
                            value={authenticationSelection.authExecId}
                        >
                            <div className="flex items-start justify-start gap-3 flex-1">
                                <span className="mt-0.5 shrink-0">
                                    {getAuthenticatorIcon(authenticationSelection)}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">
                                        {advancedMsg(authenticationSelection.displayName)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 whitespace-normal">
                                        {advancedMsg(authenticationSelection.helpText)}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 rtl:rotate-180 text-muted-foreground shrink-0" />
                        </Button>
                    ))}
                </div>
            </form>
        </Template>
    );
}
