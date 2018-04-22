# -*- coding: utf-8 -*-
"""
Created on Fri Mar 16 04:37:14 2018

@author: trying
"""

import unittest
import generator as algo
import random 

tt,cc,lt,lab,ttt,capstone,cla,pro=0,26,42,47,55,61,71,121
proNum=121
claNum=83
class TestAlgo(unittest.TestCase):
    def setUp(self):
        
        self.courses=algo.readJson("https://api.myjson.com/bins/h2c9v")
        self.rowRef=algo.referenceRows()
        self.rowRef,self.courses=algo.initializeValue(self.rowRef,self.courses)

        
    def test_a_referenceRows(self): 
        self.assertEqual(len(self.rowRef),249)
        self.assertEqual(self.rowRef[0].roomName,"Think Tank 1")
        
    def test_b_timetableInitial(self):  #check for whether the timetable is working or not
        timet=algo.timetableInitial(5,10)
        self.assertEqual(timet[23][5],-500)
        self.assertEqual(timet[45][10],-500)
        self.assertEqual(timet[0][6],-1)
        
    def test_c_initializeValue(self):
        self.assertEqual(self.rowRef[cla+1],2)
        self.assertEqual(self.courses[0].pillar,"ISTD")
        
    def test_d_Room(self):
        room = algo.Room("name","type")
        self.assertEqual(room.roomName,"name")
        self.assertEqual(room.relatedRooms,[])
        room1= algo.Room("roomname","type",[2,3,4])
        self.assertEqual(room1.relatedRooms,[2,3,4])
        
    def test_e_checkSchedule(self):
        timet=algo.timetableInitial(5,10)
        self.assertFalse(algo.checkSchedule(timet,100,3,6))
        self.assertTrue(algo.checkSchedule(timet,23,6,10))
        
    def test_f_setSchedule(self):
        timet=algo.timetableInitial(5,10)
        timet=algo.setSchedule(timet,100,3,6,10)
        self.assertEqual(timet[100][3],10)
        self.assertNotEqual(timet[100][6],10)
        
    def test_g_generator(self):
        randBreak1=random.randint(5,10)     #random break 30mins for monday
        randBreak2=random.randint(62,67)         #random break 30mins for Thursday
        self.currentSchedule=algo.generator(self.courses,self.rowRef,1,2,3,4,randBreak1,randBreak2)
        self.assertEqual(self.currentSchedule[0][0],"Fail")
        
    def test_h_mutation(self):
        tt,cc,lt,cla,pro=0,26,42,50,100

        rawParams=[[23,24,25,26,27,28],[1,2,3,4,5,6],[11,12,13,14,15,16]]
        a=algo.mutation([0,1,2],rawParams)
        
        self.assertTrue(rawParams[0] in a)
        self.assertTrue(len(a)==9)

if __name__ == '__main__':
    unittest.main()