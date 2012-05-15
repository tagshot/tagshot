require 'spec_helper'

describe PhotoData do
  let(:photo) { FactoryGirl.create(:photo) }

  it 'should have meta properties' do
    photo.data.meta_properties.size.should > 0
  end

  it 'should not write readonly properties' do
    photo.data.update_meta_properties! date: 'today', lens: 5000
    photo.data.lens.should be_nil
  end

  it 'should write non readonly properties' do
    photo.data.update_meta_properties! caption: 'new cap'
    photo.data.caption.should == 'new cap'
  end
end
