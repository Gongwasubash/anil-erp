-- Function to get user with school information for login
CREATE OR REPLACE FUNCTION login_user(p_username VARCHAR, p_password VARCHAR)
RETURNS JSON AS $$
DECLARE
  v_user RECORD;
  v_result JSON;
BEGIN
  -- Try to find user in users table first
  SELECT u.*, s.school_name, s.logo_url 
  INTO v_user
  FROM users u
  LEFT JOIN schools s ON u.school_id = s.id
  WHERE u.username = p_username AND u.password = p_password AND u.status = 'Active';
  
  IF v_user.id IS NOT NULL THEN
    -- Update last login
    UPDATE users SET last_login = NOW() WHERE id = v_user.id;
    
    SELECT json_build_object(
      'id', v_user.id,
      'username', v_user.username,
      'role', v_user.role,
      'school_id', v_user.school_id,
      'school_name', v_user.school_name,
      'logo_url', v_user.logo_url,
      'status', 'success'
    ) INTO v_result;
    
    RETURN v_result;
  END IF;
  
  -- Try to find in schools table (legacy)
  SELECT s.*, 'Admin' as role
  INTO v_user
  FROM schools s
  WHERE s.username = p_username AND s.password = p_password;
  
  IF v_user.id IS NOT NULL THEN
    SELECT json_build_object(
      'id', v_user.id,
      'username', v_user.username,
      'role', 'Admin',
      'school_id', v_user.id,
      'school_name', v_user.school_name,
      'logo_url', v_user.logo_url,
      'status', 'success'
    ) INTO v_result;
    
    RETURN v_result;
  END IF;
  
  -- No user found
  SELECT json_build_object(
    'status', 'error',
    'message', 'Invalid username or password'
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;