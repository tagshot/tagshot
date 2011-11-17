require 'spec_helper'

describe Photo do
  
  describe 'attributes' do
    before(:all) { @photo = Factory(:photo) }
    
    it { @photo.should_not accept_values_for(:file, '', nil) }
    it { @photo.should_not accept_values_for(:size, '', nil) }
    
    it 'should not accept two photos for same file in same source' do
      second_photo = Factory.build(:photo, :file => @photo.file, 
                              :source => @photo.source)
      second_photo.file.should == @photo.file
      second_photo.source_id.should == @photo.source_id
      second_photo.should_not be_valid
    end
  end
  
  describe '#update_tags' do
    let(:photo) { Factory(:photo_with_tags) }
    it 'should do nothing if no array is given' do
      photo.tags.names.count.should == 3
      photo.update_tags(nil)
      photo.tags.names.count.should == 3
      photo.update_tags("abc")
      photo.tags.names.count.should == 3
    end
    it 'should remove all tags if empty array is given' do
      photo.tags.names.count.should == 3
      photo.update_tags([])
    end
    it 'should replace all tags' do
      
    end
  end
  
  describe 'has tags assoization' do
    it 'should return string array' do
      photo = Factory(:photo_with_tags)
      photo.tags.names.should == ['a', 'b', 'c']
    end
    
    it 'should add a new tag' do
      photo = Factory(:photo_with_tags)
      photo.tags << 'd'
      photo.tags.names.should == ['a', 'b', 'c', 'd']
    end
    
    it 'should set new tags' do
      photo = Factory(:photo_with_tags)
      photo.tags = ['a', 'b']
      photo.tags.names.should == ['a', 'b']
    end
    
    it 'should add new tags' do
      photo = Factory(:photo_with_tags)
      photo.tags += ['d', 'e']
      photo.tags.names.should == ['a', 'b', 'c', 'd', 'e']
    end
    
    it 'should remove a tag' do
      photo = Factory(:photo_with_tags)
      photo.tags.delete 'b'
      photo.tags.names.should == ['a', 'c']
    end
    
    it 'should remove tags' do
      photo = Factory(:photo_with_tags)
      photo.tags -= ['a', 'c']
      photo.tags.names.should == ['b']
    end
  end
  
  describe 'has properties assoization' do
    it 'should return property hash' do
      photo = Factory(:photo_with_properties)
      photo.properties.to_hash.should == {'Meta1' => 'Value1', 'Meta2' => 'Value2'}
    end
    
    it 'should add new properties' do
      photo = Factory(:photo_with_properties)
      photo.properties += {'Meta2' => 'Value2.2', 'Meta3' => 'Value3'}
      photo.properties.to_hash.should == {
        'Meta1' => 'Value1', 
        'Meta2' => ['Value2', 'Value2.2'], 
        'Meta3' => 'Value3'
      }
    end
    
    it 'should delete properties with name' do
      photo = Factory(:photo_with_properties)
      photo.properties += {'Meta2' => 'Value2.2', 'Meta3' => 'Value3'}
      photo.properties.delete('Meta2')
      photo.properties.to_hash.should == {'Meta1' => 'Value1', 'Meta3' => 'Value3'}
    end
  end
end
