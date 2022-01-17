import { Carbon } from "../../core/libs/Carbon";

export async function execute(): Promise<void> {
    console.log('I am running every second: ' + Carbon.now());
}
