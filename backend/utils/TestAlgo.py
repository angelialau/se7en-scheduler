# -*- coding: utf-8 -*-
"""
Created on Fri Mar 16 04:37:14 2018

@author: trying
"""

import unittest
from unittest import mock
import random 
import sys

tt,cc,lt,lab,ttt,capstone,cla,pro=0,26,42,47,55,61,71,121
proNum=121
claNum=83
class TestAlgo(unittest.TestCase):
    def setUp(self):

        filename = "./fake_data/testAlgoData.json"
        file = open(filename, 'r')
        jsonString = file.read()
    
        testargs = ["prog", jsonString]

        with mock.patch('sys.argv', testargs):
            #print(sys.argv[1])
            import generator1 as algo
            #algo.mainFunction()
            self.courses,self.seniorCourseList,self.CapstoneNum=algo.readJson()
            self.courses,self.rowRef=algo.initializeValue(self.courses)
            
            self.timet=algo.timetableInitial(5,10)

            self.courseNum=1
            self.schedule = algo.capstoneInitial(self.courses,self.timet,self.courseNum)
            self.room = algo.Room("name","type")
            self.room1= algo.Room("roomname","type",[2,3,4])
            index=[0,1,2]
            params=[[0,0,0],[1,1,1],[2,2,2],[3,3,3],[4,4,4],[5,5,5]]
        
            self.params=algo.saveParams(index,params)
            self.checkSchedule1=algo.checkSchedule(self.timet,100,3,6)
            self.checkSchedule2=algo.checkSchedule(self.timet,23,6,10)
    def test_a_referenceRows(self):     #check for the rows
        self.assertEqual(len(self.rowRef),297)
        self.assertEqual(self.rowRef[0].roomName,"Think Tank 1")
        
    def test_b_timetableInitial(self):  #check for whether the timetable is working or not
        self.assertEqual(self.timet[23][5],-500)
        self.assertEqual(self.timet[45][10],-500)
        self.assertEqual(self.timet[0][6],-1)
        
    def test_c_capStoneInitial(self):
        profList=self.courses[self.courseNum].sessions[0]["proID"]

        self.assertEqual(self.schedule[83][64],-500)
        self.assertEqual(self.schedule[83][37],-500)
    
        self.assertEqual(self.schedule[profList[0]][65],"Capstone")
        self.assertEqual(self.schedule[profList[0]][35],"Capstone")       
        
    def test_d_Room(self):              
        self.assertEqual(self.room.roomName,"name")
        self.assertEqual(self.room.relatedRooms,[])
        self.assertEqual(self.room1.relatedRooms,[2,3,4])
        
    def test_e_checkSchedule(self):
        self.assertFalse(self.checkSchedule1)
        self.assertTrue(self.checkSchedule2)
        
    def test_g_saveParams(self):
        self.assertEqual(self.params,[[0,0,0],[1,1,1],[2,2,2]])

if __name__ == '__main__':
    unittest.main()