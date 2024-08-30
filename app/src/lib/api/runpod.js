import sdk from "api";

import { RUNPOD_API_KEY } from "$env/static/private";

const api = sdk("@runpod/v1.0#18nw21lj8lwwiy");
api.auth(RUNPOD_API_KEY);

export default api;
