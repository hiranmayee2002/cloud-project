/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { WorkspaceInstancePhase } from "./workspace-instance";
import { RemoteTrackMessage } from "./analytics";

/**
 * IDEFrontendDashboardService enables IDE related communications
 * between the workspace to gitpod origins. Use it to communicate
 * between IDE and dashboard iframes, never use
 * `window.postMessage` directly.
 *
 * **Security Note**: never expose information about other workspaces
 * or sensitive information for the current workspace, i.e. owner token.
 */
export namespace IDEFrontendDashboardService {
    /**
     * IClient is the client side which is using in supervisor frontend
     */
    export interface IClient {
        trackEvent(msg: RemoteTrackMessage): void;
        activeHeartbeat(): void;
        setState(state: SetStateData): void;
        openDesktopIDE(url: string): void;
    }

    /**
     * IServer is the server side which is using in dashboard loading screen
     */
    export interface IServer {
        // TODO(hw): to be removed after IDE deployed
        sendStatusUpdate(status: Status): void;
        // TODO(hw): end of todo
        sendInfoUpdate(info: Info): void;
        relocate(url: string): void;
        openBrowserIDE(): void;
    }

    /**
     * Info defined the information that `supervisor/frontend` requires.
     */
    export interface Info {
        workspaceID: string;
        loggedUserId: string;
        ownerId: string;

        instanceId?: string;
        ideUrl?: string;
        statusPhase?: WorkspaceInstancePhase;

        workspaceDescription: string;
        workspaceType: string;
        credentialsToken: string;
    }

    // TODO(hw): to be removed after IDE deployed
    export type Status = Info;
    // TODO(hw): end of todo

    export interface SetStateData {
        ideFrontendFailureCause?: string;
        desktopIDE?: {
            clientID: string;
            link: string;
            label?: string;
        };
    }

    // TODO(hw): to be removed after IDE deployed
    export interface StatusUpdateEventData {
        // protocol version
        version?: number;
        type: "ide-status-update";
        status: Status;
    }
    // TODO(hw): end of todo

    export interface InfoUpdateEventData {
        // protocol version
        version?: number;
        type: "ide-info-update";
        info: Info;
    }

    export interface HeartbeatEventData {
        type: "ide-heartbeat";
    }

    export interface TrackEventData {
        type: "ide-track-event";
        msg: RemoteTrackMessage;
    }

    export interface RelocateEventData {
        type: "ide-relocate";
        url: string;
    }

    export interface SetStateEventData {
        type: "ide-set-state";
        state: SetStateData;
    }

    export interface OpenBrowserIDE {
        type: "ide-open-browser";
    }

    export interface OpenDesktopIDE {
        type: "ide-open-desktop";
        url: string;
    }

    // TODO(hw): to be removed after IDE deployed
    export function isStatusUpdateEventData(obj: any): obj is StatusUpdateEventData {
        return obj != null && typeof obj === "object" && obj.type === "ide-status-update";
    }
    // TODO(hw): end of todo

    export function isInfoUpdateEventData(obj: any): obj is InfoUpdateEventData {
        return obj != null && typeof obj === "object" && obj.type === "ide-info-update";
    }

    export function isHeartbeatEventData(obj: any): obj is HeartbeatEventData {
        return obj != null && typeof obj === "object" && obj.type === "ide-heartbeat";
    }

    export function isTrackEventData(obj: any): obj is TrackEventData {
        return obj != null && typeof obj === "object" && obj.type === "ide-track-event";
    }

    export function isRelocateEventData(obj: any): obj is RelocateEventData {
        return obj != null && typeof obj === "object" && obj.type === "ide-relocate";
    }

    export function isSetStateEventData(obj: any): obj is SetStateEventData {
        return obj != null && typeof obj === "object" && obj.type === "ide-set-state";
    }

    export function isOpenBrowserIDE(obj: any): obj is OpenBrowserIDE {
        return obj != null && typeof obj === "object" && obj.type === "ide-open-browser";
    }

    export function isOpenDesktopIDE(obj: any): obj is OpenDesktopIDE {
        return obj != null && typeof obj === "object" && obj.type === "ide-open-desktop";
    }
}

export const IDEHeartbeatTelemetryEvent = "ide_heartbeat";
export interface IDEHeartbeatTelemetryData {
    clientKind: "vscode-desktop" | "ssh" | "jetbrains" | "vscode-desktop" | "supervisor-frontend";
    totalCount: number;
    successfulCount: number;
    workspaceId: string;
    instanceId: string;
    gitpodHost: string;
    debugWorkspace: "true" | "false";
}
export const IDE_HEARTBEAT_TELEMETRY_INTERVAL_MS = 900000; // 15 minutes
