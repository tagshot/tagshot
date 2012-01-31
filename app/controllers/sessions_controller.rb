class SessionsController < ApplicationController
  layout 'base'

  def new
    redirect_to photos_url if User.current.logged?
  end
  
  def create
    user = User.authenticate(params[:login], params[:password])
    if user
      self.current_user = user
      redirect_to root_url
    else
      flash[:error] = 'Authentication failed.'
      redirect_to new_session_url(:login => params[:login])
    end
  end
  
  def destroy
    self.current_user = nil
    
    flash[:notice] = 'Logged out.'
    redirect_to root_url
  end
end
