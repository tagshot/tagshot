require 'krb5_auth'

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

class KerberosAuthSource < AuthSource
  def authenticate(user, password)
    authenticate_kerberos(user.login, password)
  end

  def authenticate_new(login, password)
    return nil if login.blank? || password.blank?

    if authenticate_kerberos(login, password)
      User.create!(:login => login, :password => nil, :admin => false, :auth_source_id => self.id)
    else
      false
    end
  end

  def authenticate_kerberos(username, password)
    begin
      Krb5Auth::Krb5.new.get_init_creds_password(username, password)
    rescue Krb5Auth::Krb5::Exception => text
      nil
    end
  end
end
