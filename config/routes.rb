Tagshot::Application.routes.draw do

  resources :photos, :only => [:index, :update, :show]
  get 'photos/thumb/:id(.:format)' => 'photos#thumb', :as => :thumb
  get 'photos/:id/download/:width(/:height)(/:crop)/:name.:format' => 'photos#download', :as => :download_photo,
        :constraints => {
          :width => /\d+/,
          :height => /\d+/,
          :crop => /crop|scale/,
          :name => /\d+(_\d+(x\d+)?)?(_cropped|_scaled)?(_[A-z0-9-]+)?/
        }
  resources :tags, :only => [:index]
  resource :session, :only => [:new, :create, :destroy]
  get 'session/destroy' => 'sessions#destroy'

  match 'photos/*pushState' => 'photos#index'
  root :to => 'sessions#new'
end

