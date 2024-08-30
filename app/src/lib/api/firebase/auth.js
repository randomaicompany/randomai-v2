import { auth } from "root/src/lib/firebase";
import { signInAnonymously as _signInAnonymously } from "firebase/auth";

export const signInAnonymously = async () => {
  try {
    const result = await _signInAnonymously(auth);
    const user = result.user;

    return user;
  } catch (error) {
    console.error(error);
  }
};
