class User < ActiveRecord::Base
  
  belongs_to :auth_source
  
  validates_presence_of :login
  validates_uniqueness_of :login
  
  def logged?; true end
  def admin?; admin end
    
  def authenticate(password)
    auth_source.authenticate(self, password)
  end
  
  # -- class methods
  def self.authenticate(login, password)
    user = self.find_by_login(login)
    return user if user and user.authenticate(password)
    
    # create new user record if any auth source accepts authenticate new request
    AuthSource.all.each do |auth_source|
      user = auth_source.authenticate_new(login, password)
      return user if user
    end
    nil
  end
    
  def self.current
    @current || self.anonymous
  end
  
  def self.current=(user)
    @current = user
  end
  
  def self.anonymous
    AnonymousUser.instance
  end
end

class AnonymousUser < User
  validate :single_user
  def single_user
    errors.add_to_base 'A anonymous user already exists.' if self.class.find_by_login(self.class.login_id)
  end
  
  def logged?; false end
  def admin?; false end
  def destroy; false end
  def destructible?; false end
  
  def self.login_id; 'anonymous' end
  def self.instance
    user = @user_instance || find_by_login(login_id)
    return user if user
    
    user = self.new
    user.login = login_id
    user.save :validate => false
    raise "Cannot create #{login_id} user." if user.new_record?
    @user_instance = user
    user
  end
end
