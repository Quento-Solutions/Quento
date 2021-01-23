import app from '.';
import 'firebase/analytics';
import type firebase from 'firebase';

let ana : firebase.analytics.Analytics | null = null;

if (process.client)
{
    ana = app.analytics();
    console.log("Firebase Analytics Active")
}

export default ana;