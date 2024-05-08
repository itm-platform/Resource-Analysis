export default {
    "groups": [
      {
        "id": 1,
        "name": "01-01-2024",
        "columns": [
          {
            "id": "capacity",
            "name": "Capacity"
          },
          {
            "id": "estimated",
            "name": "Estimated"
          },
          {
            "id": "actual",
            "name": "Actual"
          }
        ]
      },
      {
        "id": 2,
        "name": "08-01-2024",
        "columns": [
          {
            "id": "capacity",
            "name": "Capacity"
          },
          {
            "id": "estimated",
            "name": "Estimated"
          },
          {
            "id": "actual",
            "name": "Actual"
          }
        ]
      },
      {
        "id": 3,
        "name": "Sum of Periods",
        "columns": [
          {
            "id": "capacity",
            "name": "Capacity"
          },
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
                "columnId": "capacity",
                "value": 2400,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2400
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 1800,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1800
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 1260,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1260
                  }
                }
              }
            ]
          },
          {
            "groupId": 2,
            "values": [
              {
                "columnId": "capacity",
                "value": 720,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 720
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 1800,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1800
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 1260,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1260
                  }
                }
              }
            ]
          },
          {
            "groupId": 3,
            "values": [
              {
                "columnId": "capacity",
                "value": 3120,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 3120
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 3600,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 3600
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 2520,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2520
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
            "subType": "waterfall",
            "render": {
              "func": "renderEntityName",
              "params": {
                "name": "Project name 1",
                "entityType": "project",
                "entitySubType": "waterfall"
              }
            },
            "children": [
              {
                "type": "workItem",
                "name": "Task name 1",
                "values": [
                  {
                    "groupId": 1,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 600,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 600
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 540,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 540
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 2,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 600,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 600
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 540,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 540
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 3,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 1200,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1200
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 1080,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1080
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "type": "workItem",
                "name": "Task name 2 with a longuer name that exceeds usual length",
                "values": [
                  {
                    "groupId": 1,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 1200,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1200
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 720,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 720
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 2,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 1200,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1200
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 720,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 720
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 3,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 2400,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 2400
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 1440,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1440
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            "values": [
              {
                "groupId": 1,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 1800,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1800
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 1260,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1260
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 2,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 1800,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1800
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 1260,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1260
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 3,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 3600,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 3600
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 2520,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 2520
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
                "columnId": "capacity",
                "value": 2400,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2400
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 1500,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1500
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 2340,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2340
                  }
                }
              }
            ]
          },
          {
            "groupId": 2,
            "values": [
              {
                "columnId": "capacity",
                "value": 2400,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2400
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 1500,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1500
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 2340,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2340
                  }
                }
              }
            ]
          },
          {
            "groupId": 3,
            "values": [
              {
                "columnId": "capacity",
                "value": 4800,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 4800
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 3000,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 3000
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 4680,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 4680
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
            "subType": "waterfall",
            "render": {
              "func": "renderEntityName",
              "params": {
                "name": "Project name 1",
                "entityType": "project",
                "entitySubType": "waterfall"
              }
            },
            "children": [
              {
                "type": "workItem",
                "name": "Task name 1",
                "values": [
                  {
                    "groupId": 1,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 720,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 720
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 780,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 780
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 2,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 720,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 720
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 780,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 780
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 3,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 1440,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1440
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 1560,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1560
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            "values": [
              {
                "groupId": 1,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 720,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 720
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 780,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 780
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 2,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 720,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 720
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 780,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 780
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 3,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 1440,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1440
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 1560,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1560
                      }
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "project",
            "name": "Project name 2",
            "subType": "waterfall",
            "render": {
              "func": "renderEntityName",
              "params": {
                "name": "Project name 2",
                "entityType": "project",
                "entitySubType": "waterfall"
              }
            },
            "children": [
              {
                "type": "workItem",
                "name": "Task name 3",
                "values": [
                  {
                    "groupId": 1,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 780,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 780
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 1560,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1560
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 2,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 780,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 780
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 1560,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1560
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 3,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 1560,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1560
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 3120,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 3120
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            "values": [
              {
                "groupId": 1,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 780,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 780
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 1560,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1560
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 2,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 780,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 780
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 1560,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1560
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 3,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 1560,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1560
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 3120,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 3120
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
                "columnId": "capacity",
                "value": 2400,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2400
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 1800,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1800
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 600,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 600
                  }
                }
              }
            ]
          },
          {
            "groupId": 2,
            "values": [
              {
                "columnId": "capacity",
                "value": 2400,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 2400
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 1800,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1800
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 600,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 600
                  }
                }
              }
            ]
          },
          {
            "groupId": 3,
            "values": [
              {
                "columnId": "capacity",
                "value": 4800,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 4800
                  }
                }
              },
              {
                "columnId": "estimated",
                "value": 3600,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 3600
                  }
                }
              },
              {
                "columnId": "actual",
                "value": 1200,
                "render": {
                  "func": "renderDuration",
                  "params": {
                    "value": 1200
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
            "subType": "waterfall",
            "render": {
              "func": "renderEntityName",
              "params": {
                "name": "Project name 2",
                "entityType": "project",
                "entitySubType": "waterfall"
              }
            },
            "children": [
              {
                "type": "workItem",
                "name": "Task name 3",
                "values": [
                  {
                    "groupId": 1,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 1800,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1800
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 600,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 600
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 2,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 1800,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1800
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 600,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 600
                          }
                        }
                      }
                    ]
                  },
                  {
                    "groupId": 3,
                    "values": [
                      {
                        "columnId": "capacity",
                        "render": {
                          "func": "renderDuration",
                          "params": {}
                        }
                      },
                      {
                        "columnId": "estimated",
                        "value": 3600,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 3600
                          }
                        }
                      },
                      {
                        "columnId": "actual",
                        "value": 1200,
                        "render": {
                          "func": "renderDuration",
                          "params": {
                            "value": 1200
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            "values": [
              {
                "groupId": 1,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 1800,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1800
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 600,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 600
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 2,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 1800,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1800
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 600,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 600
                      }
                    }
                  }
                ]
              },
              {
                "groupId": 3,
                "values": [
                  {
                    "columnId": "capacity",
                    "render": {
                      "func": "renderDuration",
                      "params": {}
                    }
                  },
                  {
                    "columnId": "estimated",
                    "value": 3600,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 3600
                      }
                    }
                  },
                  {
                    "columnId": "actual",
                    "value": 1200,
                    "render": {
                      "func": "renderDuration",
                      "params": {
                        "value": 1200
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