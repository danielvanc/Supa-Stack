// TODO: Seperate out types into their own apporpriate files

/**
 * @description Type for all ENV variables
 */
interface EnvVars {
  ENV: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    SESSION_SECRET: string;
  };
}

/**
 * @description Type for all User information
 */
interface User {
  id?: string;
  email?: string;
  full_name?: string;
  user_metadata?: { [key: string]: any };
}

/**
 * @description General type for error handling
 */
interface Errors {
  error: Boolean;
  message: string;
}

interface TextualDropdownProps {
  title: string;
  description: string;
  type: string;
  action: string;
}
