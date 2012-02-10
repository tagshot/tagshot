Tagshot::Application.routes.draw do

  resources :photos, :only => [:index, :update, :show] do
    resources :properties, :only => [:index]
  end
  get 'photos/thumb/:id(.:format)' => 'photos#thumb', :as => :thumb
  get 'photos/:id/download/:width(/:height)(/:crop)/:name.:format' => 'photos#download', :as => :download_photo,
        :constraints => {
          :width => /\d+/,
          :height => /\d+/,
          :crop => /crop|scale/,
          :name => /[A-z0-9]+[A-z0-9\-_]*/
        }
  resources :tags, :only => [:index]
  resource :session, :only => [:new, :create, :destroy]
  resources :sources, only: [:index]
  get 'admin' => 'admin#index'
  get 'session/destroy' => 'sessions#destroy'

  root :to => 'photos#index'
  get '/*pushState' => 'photos#index'
end

