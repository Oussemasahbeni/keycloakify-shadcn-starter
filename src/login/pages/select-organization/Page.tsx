import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { Building2 } from "lucide-react";
import { type MouseEvent, useRef, useState } from "react";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "select-organization.ftl");

    const { msg } = useI18n();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);
    const organizationInputRef = useRef<HTMLInputElement>(null);

    const dir = document.dir || "ltr";

    const onOrganizationClick =
        (organizationAlias: string) => (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();

            if (!organizationInputRef.current || !formRef.current) {
                return;
            }

            organizationInputRef.current.value = organizationAlias;
            setIsSubmitting(true);

            if (typeof formRef.current.requestSubmit === "function") {
                formRef.current.requestSubmit();
                return;
            }

            formRef.current.submit();
        };

    const onSelectChange = (value: string) => {
        setSelectedOrg(value);
        if (!organizationInputRef.current || !formRef.current) {
            return;
        }

        organizationInputRef.current.value = value;
        setIsSubmitting(true);

        if (typeof formRef.current.requestSubmit === "function") {
            formRef.current.requestSubmit();
            return;
        }

        formRef.current.submit();
    };

    const organizations = kcContext.user.organizations ?? [];
    const useSelect = organizations.length > 3;

    return (
        <Template headerNode={msg("organization.selectTitle")}>
            <form ref={formRef} action={kcContext.url.loginAction} method="post">
                <div id="kc-user-organizations" className="space-y-2">
                    <h2 className="text-md font-semibold">
                        {msg("organization.select")}
                    </h2>
                    {useSelect ? (
                        <div className="space-y-2">
                            <Select
                                value={selectedOrg}
                                onValueChange={onSelectChange}
                                disabled={isSubmitting}

                            >
                                <SelectTrigger className="w-full" dir={dir}>
                                    <SelectValue
                                        placeholder={msg("organization.pickPlaceholder")}
                                    />
                                </SelectTrigger>
                                <SelectContent dir={dir}>
                                    {organizations.map(({ alias, name }) => (
                                        <SelectItem key={alias} value={alias}>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                {name ?? alias}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {organizations.map(({ alias, name }) => (
                                <li key={alias}>
                                    <Button
                                        id={`organization-${alias}`}
                                        type="button"
                                        variant="outline"
                                        onClick={onOrganizationClick(alias)}
                                        disabled={isSubmitting}
                                        className="w-full h-auto p-4 flex items-center gap-3 justify-start hover:bg-accent hover:border-primary transition-colors"
                                    >
                                        <Building2 className="w-5 h-5 text-muted-foreground shrink-0" />
                                        <span className="font-medium text-sm">
                                            {name ?? alias}
                                        </span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <input ref={organizationInputRef} type="hidden" name="kc.org" />
            </form>
        </Template>
    );
}
