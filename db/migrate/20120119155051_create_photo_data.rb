class CreatePhotoData < ActiveRecord::Migration
  def change
    create_table :photo_data do |t|
      t.integer  :photo_id
      t.datetime :date
      t.string   :owner
      t.string   :creator
      t.integer  :aperture_denominator, :limit => 2
      t.integer  :aperture_numerator, :limit => 2
      t.integer  :exposureTime_denominator, :limit => 2
      t.interger :exposureTime_numerator, :limit => 2
      t.string   :lens
      t.integer  :isoSpeedRating
      t.string   :exposureMode

      t.timestamps
    end
  end
end
