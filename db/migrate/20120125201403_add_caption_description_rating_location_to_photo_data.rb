class AddCaptionDescriptionRatingLocationToPhotoData < ActiveRecord::Migration
  def change
    add_column :photo_data, :caption, :string
    add_column :photo_data, :rating, :integer
    add_column :photo_data, :location, :string
    add_column :photo_data, :description, :string
  end
end
