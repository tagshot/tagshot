require 'spec_helper'

describe Photo do

  describe 'attributes' do
    before(:all) { @photo = FactoryGirl.create(:photo) }

    it { @photo.should_not accept_values_for(:file, '', nil) }
    it { @photo.should_not accept_values_for(:size, '', nil) }

    it 'should not accept two photos for same file in same source' do
      second_photo = FactoryGirl.build(:photo, :file => @photo.file,
                              :source => @photo.source)
      second_photo.file.should == @photo.file
      second_photo.source_id.should == @photo.source_id
      second_photo.should_not be_valid
    end
  end

  describe 'has tags assoization' do
    it 'should return string array' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tag_names.should == ['a', 'b', 'c']
    end

    it 'should remove all tags if nil given' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tags = nil
      photo.tag_names.should == []
    end

    it 'should remove all tags when empty array given' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tags = []
      photo.tag_names.should == []
    end

    it 'should add a new tag' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tags << 'd'
      photo.tag_names.should == ['a', 'b', 'c', 'd']
    end

    it 'should set new tags' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tags = ['a', 'b']
      photo.tag_names.should == ['a', 'b']
    end

    it 'should add new tags' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tags += ['d', 'e']
      photo.tag_names.should == ['a', 'b', 'c', 'd', 'e']
    end

    it 'should remove a tag' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tags.delete 'b'
      photo.tag_names.should == ['a', 'c']
    end

    it 'should remove tags' do
      photo = FactoryGirl.create(:photo_with_tags)
      photo.tags -= ['a', 'c']
      photo.tag_names.should == ['b']
    end
  end

  describe 'has properties assoization' do
    it 'should return property hash' do
      photo = FactoryGirl.create(:photo_with_properties)
      photo.properties.to_hash.should == {'Meta1' => 'Value1', 'Meta2' => 'Value2'}
    end

    it 'should add new properties' do
      photo = FactoryGirl.create(:photo_with_properties)
      photo.properties += {'Meta2' => 'Value2.2', 'Meta3' => 'Value3'}
      photo.properties.to_hash.should == {
        'Meta1' => 'Value1',
        'Meta2' => ['Value2', 'Value2.2'],
        'Meta3' => 'Value3'
      }
    end

    it 'should delete properties with name' do
      photo = FactoryGirl.create(:photo_with_properties)
      photo.properties += {'Meta2' => 'Value2.2', 'Meta3' => 'Value3'}
      photo.properties.delete('Meta2')
      photo.properties.to_hash.should == {'Meta1' => 'Value1', 'Meta3' => 'Value3'}
    end
  end
end
