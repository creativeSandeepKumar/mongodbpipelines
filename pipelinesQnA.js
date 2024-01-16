// Question 1. How many users are active?
// Answer -
[
  {
    $match: {
      isActive: true,
    },
  },
  {
    $count: "ActiveUsers",
  },
];

// Question 2. What is the average age of all users
[
  {
    $group: {
      _id: null,
      avarageAge: {
        $avg: "$age",
      },
    },
  },
];

// Question 3. List the top 5 most common favourite fruits among the users
[
  {
    $group: {
      _id: "$favoriteFruit",
      count: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
  {
    $limit: 5,
  },
];

// Question 4: Find the total numbers of males and females
[
  {
    $group: {
      _id: "$gender",
      genderCount: {
        $sum: 1,
      },
    },
  },
];

// Question 5: Which country has the highest number of the registered users?
[
  {
    $group: {
      _id: "$company.location.country",
      userCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      userCount: -1,
    },
  },
  {
    $limit: 2,
  },
];

// Question 6: List all unique eye colors present in the collection
[
  {
    $group: {
      _id: "$eyeColor",
    },
  },
];

// Qestion 7: What is the average number of tags per user
// method 1 -
[
  {
    $unwind: "$tags",
  },
  {
    $group: {
      _id: "$_id",
      numberOfTags: { $sum: 1 },
    },
  },
  {
    $group: {
      _id: null,
      avgNumOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
];

// Method 2:
[
  {
    $addFields: {
      numberOfTags: {
        $size: { $ifNull: ["$tags", []] },
      },
    },
  },
  {
    $group: {
      _id: null,
      avgNumOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
];

// Question 8: How many users have "enim" as of one thier tags
[
  {
    $match: {
      tags: "enim",
    },
  },
  {
    $count: "userWithenimTag",
  },
];

// Question 10: What are the names and age of users who are inactive and have 'velit' as a tag?
[
  {
    $match: {
      isActive: false,
      tags: "velit",
    },
  },
  {
    $project: {
      name: 1,
      age: 1,
    },
  },
];

// Question 11: How amny users have a phone number starting with  '+1 (940)'
[
  {
    $match: {
      "company.phone": /^\+1 \(940\)/,
    },
  },
  {
    $count: "usersWithSpecialPhoneNumber",
  },
];

// Question 12: Who has registered the most recently
[
  {
    $sort: {
      registered: -1,
    },
  },
  {
    $limit: 3,
  },
  {
    $project: {
      name: 1,
      registered: 1,
      favoriteFruit: 1,
    },
  },
];

// Question 13: Categorized users by their favoriteFruit
[
  {
    $group: {
      _id: "$favoriteFruit",
      users: { $push: "$name" },
    },
  },
];

// 14: How many users have 'ad' as the second tag in their list of tags?
[
  {
    $match: {
      "tags.1": "ad",
    },
  },
  {
    $count: "secondTagAd",
  },
];

// 15: Find users have enim and id both have their tags
[
  {
    $match: {
      tags: { $all: ["enim", "id"] },
    },
  },
];

// 16: List all companies located in the USA with their corresponding users count
[
  {
    $match: {
      "company.location.country": "USA",
    },
  },
  {
    $group: {
      _id: "$company.title",
      userCount: { $sum: 1 },
    },
  },
];

// Overview of lookup
// method 1
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details",
    },
  },
  {
    $addFields: {
      author_details: {
        $first: "$author_details",
      },
    },
  },
],
  // method 2
  [
  ({
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details",
    },
  },
  {
    $addFields: {
      author_details: {
        $arrayElemAt: ["$author_details", 0],
      },
    },
  })
];


// To find user fullname and avatar which from booking collection lookups through booking collection newteachers collection, and then users collection. Then finally show with booking data with user fullname and avatar 
[
  {
    $match: {
      "teachers.teacherId": ObjectId(
        "65a11a9c96068861b68d933f"
      ),
    },
  },
  {
    $lookup: {
      from: "newteachers",
      localField: "teachers.teacherId",
      foreignField: "_id",
      as: "teacher",
    },
  },
  {
    $unwind: "$teacher",
  },
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $unwind: "$user",
  },
  {
    $project: {
      user: {
        fullName: "$user.fullName",
        avatar: "$user.avatar",
      },
      teachers: {
        $arrayElemAt: ["$teachers", 0],
      },
    },
  },
]
