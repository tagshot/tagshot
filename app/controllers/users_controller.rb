class UsersController < AdminController

	def index
		@users = User.all
	end

	def create
    if params[:users]
      params[:users].each do |key, value|
        User.transaction do
          User.find(key).update_attributes(value)
        end
      end
      redirect_to users_path, notice: 'User updated.'
    else
      @user = User.new(params[:user])
      # @user.password = @user.login
      if @user.save
        redirect_to users_path, notice: 'User created.'
      else
        redirect_to users_path, alert: 'User cannot be created.'
      end
    end
	end

  def delete
    @user = User.find(params[:id])
  end

	def destroy
		@user = User.find(params[:id])

    respond_to do |format|
      if @user and not @user.admin? and @user.destroy
        format.html do
          redirect_to users_url, :notice => 'User was successfully deleted.'
        end
      else
        format.html do
          redirect_to users_url, :alert => 'User cannot be deleted.'
        end
      end
    end
	end
end