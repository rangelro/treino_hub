import { OneSignal } from "react-native-onesignal";

export function configOneSignal() {
    OneSignal.initialize('NlJNrqRJzMIypFp8j8CFq9KKYxxfPATN5UcBFHxNhPA');

    OneSignal.Notifications.requestPermission(true).then((response) => {
        console.log('Permissão de notificações:', response);
    });

}