class StoreFractionAsStringInPhotoData < ActiveRecord::Migration
  def change
    remove_column :photo_data, :aperture_denominator
    remove_column :photo_data, :aperture_numerator
    remove_column :photo_data, :exposureTime_denominator
    remove_column :photo_data, :exposureTime_numerator
    add_column :photo_data, :aperture, :string
    add_column :photo_data, :exposureTime, :string
  end
end
