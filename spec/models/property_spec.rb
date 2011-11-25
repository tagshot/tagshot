require 'spec_helper'

describe Property do
  let(:property) { Factory(:property) }
  
  it { property.should_not accept_values_for(:name, "", nil) }
  
  it 'should require a valid photo' do
    property.photo_id = nil
    property.should_not be_valid
    property.photo_id = Photo.last.id + 1
    property.should_not be_valid
  end
end
