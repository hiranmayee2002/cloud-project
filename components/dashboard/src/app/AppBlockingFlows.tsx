/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { FC, lazy } from "react";
import { useShowDedicatedSetup } from "../dedicated-setup/use-show-dedicated-setup";
import { useShowUserOnboarding } from "../onboarding/use-show-user-onboarding";
import { useHistory } from "react-router";
import { useCurrentOrg } from "../data/organizations/orgs-query";
import { OrgNamingStep } from "../dedicated-setup/OrgNamingStep";
import { useAuthenticatedUser } from "../data/current-user/authenticated-user-query";

const UserOnboarding = lazy(() => import(/* webpackPrefetch: true */ "../onboarding/UserOnboarding"));
const DedicatedSetup = lazy(() => import(/* webpackPrefetch: true */ "../dedicated-setup/DedicatedSetup"));

// This component handles any flows that should come after we've loaded the user/orgs, but before we render the normal app chrome.
// Since this runs before the app is rendered, we should avoid adding any lengthy async calls that would delay the app from loading.
export const AppBlockingFlows: FC = ({ children }) => {
    const history = useHistory();
    const { data: user } = useAuthenticatedUser();
    const org = useCurrentOrg();
    const showDedicatedSetup = useShowDedicatedSetup();
    const showUserOnboarding = useShowUserOnboarding();

    // This shouldn't happen, but if it does don't render anything yet
    if (!user) {
        return <></>;
    }

    // Handle dedicated setup if necessary
    if (showDedicatedSetup.showSetup) {
        return (
            <DedicatedSetup
                onComplete={() => {
                    showDedicatedSetup.markCompleted();
                    // keep this here to avoid flashing a different page while we reload below
                    history.push("/settings/git");
                    // doing a full page reload here to avoid any lingering setup-related state issues
                    document.location.href = "/settings/git";
                }}
            />
        );
    }

    // New user onboarding flow
    if (showUserOnboarding && user) {
        return <UserOnboarding user={user} />;
    }

    if (!org.data) {
        return <OrgNamingStep onComplete={() => {}} />;
    }

    return <>{children}</>;
};
