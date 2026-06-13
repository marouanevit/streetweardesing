import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vzmfxuogwqjqepzhxqzn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WuWUAJIUvsMJcR9PPuK2UA_GMr7iZDs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
