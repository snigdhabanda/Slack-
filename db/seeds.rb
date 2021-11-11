# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Channel.find(10).destroy!
# Channel.destroy_all

# channel3 = Channel.create({name: "General", dm: false})
# channel4 = Channel.create({name: "General", dm: false})

# channel5 = Channel.create({name: "Meg Thee Stallion", dm: false})
# channel6 = Channel.create({name: "Fauci", dm: false})
channel7 = Channel.create({name: "Obama", dm: true})
channel8 = Channel.create({name: "Hilary", dm: true})

# channel1 = Channel.create({name: "General"})
# channel2 = Channel.create({name: "Random"})

# cm1 = ChannelMember.create({channel_id: 1, member_id: 9, creator: true})
# cm2 = ChannelMember.create({channel_id: 2, member_id: 9, creator: true})
# cm3 = ChannelMember.create({channel_id: 1, member_id: 8, creator: false})
# cm4 = ChannelMember.create({channel_id: 2, member_id: 8, creator: false})
# cm5 = ChannelMember.create({channel_id: 1, member_id: 7, creator: false})
# cm6 = ChannelMember.create({channel_id: 2, member_id: 7, creator: false})

# m1 = Message.create({body: "hi there!", author_id: 9, recipient_id: 9, channel_id: 1})
# m2 = Message.create({body: "im working!", author_id: 9, recipient_id: 9, channel_id: 1})
# m3 = Message.create({body: "lets goo", author_id: 9, recipient_id: 9, channel_id: 1})
# m4 = Message.create({body: "bye!", author_id: 9, recipient_id: 9, channel_id: 1})

# m1 = Message.create({body: "you're in channel 2!", author_id: 9, recipient_id: 9, channel_id: 2})
# m2 = Message.create({body: "hello!", author_id: 9, recipient_id: 9, channel_id: 2})


channel7.save!
channel8.save!

# channel3.save!
# channel4.save! 
# channel5.save!
# channel6.save! 

# puts(channel3)
# cm1.save!
# cm2.save!
# cm3.save!
# cm4.save!
# cm5.save!
# cm6.save!

# m1.save!
# m2.save!
# m3.save!
# m4.save!
