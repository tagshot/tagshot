class AddYearToSource < ActiveRecord::Migration
  def change
    add_column :sources, :year, :integer

  end
end
