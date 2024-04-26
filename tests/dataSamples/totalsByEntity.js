export default {
    "groups": [
        {
            "id": 1,
            "name": "Total",
            "columns": [
                {
                    "id": "estimated",
                    "name": "Estimated"
                },
                {
                    "id": "actual",
                    "name": "Actual"
                }
            ]
        }
    ],
    "rows": [
        {
            "type": "project",
            "name": "Project name 1",
            "render": {
                "func": "renderEntityName",
                "params": {
                    "name": "Project name 1",
                    "entityType": "project",
                    "entitySubType": "waterfall"
                }
            },
            "values": [
                {
                    "groupId": 1,
                    "values": [
                        {
                            "columnId": "estimated",
                            "value": 18210,
                            "render": {
                                "func": "renderDuration",
                                "params": {
                                    "value": 18210
                                }
                            }
                        },
                        {
                            "columnId": "actual",
                            "value": 17493,
                            "render": {
                                "func": "renderDuration",
                                "params": {
                                    "value": 17493
                                }
                            }
                        }
                    ]
                }
            ],
            "children": [
                {
                    "type": "workItem",
                    "name": "Task name 1",
                    "values": [
                        {
                            "groupId": 1,
                            "values": [
                                {
                                    "columnId": "estimated",
                                    "value": 14310,
                                    "render": {
                                        "func": "renderDuration",
                                        "params": {
                                            "value": 14310
                                        }
                                    }
                                },
                                {
                                    "columnId": "actual",
                                    "value": 14943,
                                    "render": {
                                        "func": "renderDuration",
                                        "params": {
                                            "value": 14943
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    "children": [
                        {
                            "type": "user",
                            "id": "user1",
                            "name": "User name 1",
                            "imageUrl": "UploadData/PHOTO/16by16_30168.jpg",
                            "categoryId": "category1",
                            "render": {
                                "func": "renderUserName",
                                "params": {
                                    "name": "User name 1",
                                    "imageUrl": "UploadData/PHOTO/16by16_30168.jpg",
                                    "categoryId": "category1"
                                }
                            },
                            "values": [
                                {
                                    "groupId": 1,
                                    "values": [
                                        {
                                            "columnId": "estimated",
                                            "value": 8400,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 8400
                                                }
                                            }
                                        },
                                        {
                                            "columnId": "actual",
                                            "value": 9645,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 9645
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "user",
                            "id": "user2",
                            "name": "User name 2",
                            "imageUrl": "UploadData/PHOTO/16by16_30169.jpg",
                            "categoryId": "category1",
                            "render": {
                                "func": "renderUserName",
                                "params": {
                                    "name": "User name 2",
                                    "imageUrl": "UploadData/PHOTO/16by16_30169.jpg",
                                    "categoryId": "category1"
                                }
                            },
                            "values": [
                                {
                                    "groupId": 1,
                                    "values": [
                                        {
                                            "columnId": "estimated",
                                            "value": 5910,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 5910
                                                }
                                            }
                                        },
                                        {
                                            "columnId": "actual",
                                            "value": 5298,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 5298
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "workItem",
                    "name": "Task name 2",
                    "values": [
                        {
                            "groupId": 1,
                            "values": [
                                {
                                    "columnId": "estimated",
                                    "value": 3900,
                                    "render": {
                                        "func": "renderDuration",
                                        "params": {
                                            "value": 3900
                                        }
                                    }
                                },
                                {
                                    "columnId": "actual",
                                    "value": 2550,
                                    "render": {
                                        "func": "renderDuration",
                                        "params": {
                                            "value": 2550
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    "children": [
                        {
                            "type": "user",
                            "id": "user1",
                            "name": "User name 1",
                            "imageUrl": "UploadData/PHOTO/16by16_30168.jpg",
                            "categoryId": "category1",
                            "render": {
                                "func": "renderUserName",
                                "params": {
                                    "name": "User name 1",
                                    "imageUrl": "UploadData/PHOTO/16by16_30168.jpg",
                                    "categoryId": "category1"
                                }
                            },
                            "values": [
                                {
                                    "groupId": 1,
                                    "values": [
                                        {
                                            "columnId": "estimated",
                                            "value": 3900,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 3900
                                                }
                                            }
                                        },
                                        {
                                            "columnId": "actual",
                                            "value": 2550,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 2550
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "project",
            "name": "Project name 2",
            "render": {
                "func": "renderEntityName",
                "params": {
                    "name": "Project name 2",
                    "entityType": "project",
                    "entitySubType": "waterfall"
                }
            },
            "values": [
                {
                    "groupId": 1,
                    "values": [
                        {
                            "columnId": "estimated",
                            "value": 25800,
                            "render": {
                                "func": "renderDuration",
                                "params": {
                                    "value": 25800
                                }
                            }
                        },
                        {
                            "columnId": "actual",
                            "value": 21600,
                            "render": {
                                "func": "renderDuration",
                                "params": {
                                    "value": 21600
                                }
                            }
                        }
                    ]
                }
            ],
            "children": [
                {
                    "type": "workItem",
                    "name": "Task name 3",
                    "values": [
                        {
                            "groupId": 1,
                            "values": [
                                {
                                    "columnId": "estimated",
                                    "value": 25800,
                                    "render": {
                                        "func": "renderDuration",
                                        "params": {
                                            "value": 25800
                                        }
                                    }
                                },
                                {
                                    "columnId": "actual",
                                    "value": 21600,
                                    "render": {
                                        "func": "renderDuration",
                                        "params": {
                                            "value": 21600
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    "children": [
                        {
                            "type": "user",
                            "id": "user2",
                            "name": "User name 2",
                            "imageUrl": "UploadData/PHOTO/16by16_30169.jpg",
                            "categoryId": "category1",
                            "render": {
                                "func": "renderUserName",
                                "params": {
                                    "name": "User name 2",
                                    "imageUrl": "UploadData/PHOTO/16by16_30169.jpg",
                                    "categoryId": "category1"
                                }
                            },
                            "values": [
                                {
                                    "groupId": 1,
                                    "values": [
                                        {
                                            "columnId": "estimated",
                                            "value": 7800,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 7800
                                                }
                                            }
                                        },
                                        {
                                            "columnId": "actual",
                                            "value": 15600,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 15600
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "user",
                            "id": "user3",
                            "name": "User name 3",
                            "imageUrl": "UploadData/PHOTO/16by16_30170.jpg",
                            "categoryId": "category2",
                            "render": {
                                "func": "renderUserName",
                                "params": {
                                    "name": "User name 3",
                                    "imageUrl": "UploadData/PHOTO/16by16_30170.jpg",
                                    "categoryId": "category2"
                                }
                            },
                            "values": [
                                {
                                    "groupId": 1,
                                    "values": [
                                        {
                                            "columnId": "estimated",
                                            "value": 18000,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 18000
                                                }
                                            }
                                        },
                                        {
                                            "columnId": "actual",
                                            "value": 6000,
                                            "render": {
                                                "func": "renderDuration",
                                                "params": {
                                                    "value": 6000
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}