
def set_current_user(user)
  if user && user.logged?
    session[:user_id] = user.id
    User.current = user
  else
    session[:user_id] = nil
    User.current = User.anonymous
  end
end
