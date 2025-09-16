import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { FIREBASE_ADMIN_SERVICE_CREDENTIALS } from '$env/static/private';

const admin = initializeApp(
	{
		credential: cert(JSON.parse(FIREBASE_ADMIN_SERVICE_CREDENTIALS))
	},
	'admin-sdk'
);

export const firestore = getFirestore(admin);
