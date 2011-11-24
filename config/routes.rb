Tagshot::Application.routes.draw do
  
  resources :photos, :only => [:index, :update, :show]
  
  root :to => 'photos#index'
end
