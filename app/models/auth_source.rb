class AuthSource < ActiveRecord::Base
  
  def authenticate(login, password)
    false
  end
  
  def authenticate_new(login, password)
    nil
  end
  
  def save; false end
end

class PasswordAuthSource < AuthSource
  
  def authenticate(user, password)
    return user if user and user.password == password
  end
  
  def authenticate_new(user, password)
    nil
  end
end

