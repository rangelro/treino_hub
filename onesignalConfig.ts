import { OneSignal } from "react-native-onesignal";

export function configOneSignal() {
    OneSignal.initialize('3b82353f-3df5-4c6b-add3-227de0b71e95');

    OneSignal.Notifications.requestPermission(true).then((response) => {
        console.log('Permissão de notificações:', response);
    });

}