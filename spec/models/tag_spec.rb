require 'spec_helper'

describe Tag do
  let(:tag) { FactoryGirl.create(:tag) }

  it { tag.should_not accept_values_for(:name, nil, '') }

  it 'should have a unique name' do
    invalid_tag = FactoryGirl.build(:tag, :name => tag.name)
    invalid_tag.name.should == tag.name
    invalid_tag.should_not be_valid
  end
end
