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
        "type": "user",
        "id": "user1",
        "name": "User name 1",
        "imageUrl": "UploadData/PHOTO/16by16_30168.jpg",
        "categoryId": "category1",
        "render": {
          "func": "renderUserName",
          "params": {
            "id": "user1",
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
                "value": 12300,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 12300
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 12195,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 12195
                  }
                }
              }
            ]
          }
        ],
        "children": [
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
                    "value": 12300,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 12300
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 12195,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 12195
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
                ]
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
            "id": "user2",
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
                "value": 13710,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 13710
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 20898,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 20898
                  }
                }
              }
            ]
          }
        ],
        "children": [
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
            "id": "user3",
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
        ],
        "children": [
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