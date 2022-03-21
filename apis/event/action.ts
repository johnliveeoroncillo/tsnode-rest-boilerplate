import { EventRequest } from "./request";
import { invokeEvent, invokeEventWithResponse } from "../../core/libs/Events";
import { EVENTS } from "../../helpers/Enums";

export class EventAction {

    async execute(request: EventRequest): Promise<void> {
        //OPTION 1 - Event with response
        // const data = await invokeEventWithResponse(EVENTS.EVENT_TEST, { message: request.message });
        // return data;

        //OPTION 2
        await invokeEvent(EVENTS.EVENT_TEST, { message: request.message });
    }
}