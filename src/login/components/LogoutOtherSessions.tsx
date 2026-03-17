import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import { useI18n } from "@/login/i18n";

export function LogoutOtherSessions() {
    const { msg } = useI18n();

    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id="logout-sessions"
                name="logout-sessions"
                value="on"
                defaultChecked={true}
            />
            <Label
                htmlFor="logout-sessions"
                className="text-sm font-medium cursor-pointer"
            >
                {msg("logoutOtherSessions")}
            </Label>
        </div>
    );
}
