# -*- coding: utf-8 -*-
"""
Created on Fri Mar 30 02:37:44 2018

@author: trying
"""


import json
from urllib.request import urlopen
import random
import copy
import time
import re
import sys

tt,cc,lt,lab,ttt,capstone,cla,pro=0,26,42,47,55,61,71,121
proNum=121
claNum=83
term78=-1 #become 7 or 8 if there is term7 or 8
def readJson(url):
    global term78
    #weather = urlopen(url)
    weather = sys.argv[1]
    wjson = json.loads(weather)
    courses=[]
    i=0
    for key,value in wjson.items():
        courses.append(Course(value["course_no"],value["core"],len(value["sessions"]),value["term"],value["no_classes"],value["class_size"]))
        courses[i].sessions=value["sessions"]
        if courses[i].term in [7,8]:
            term78=courses[i].term
        i+=1
    return courses

class Room():
    def __init__(self,roomName,roomType,relatedRooms=[]):
        self.roomName=roomName
        self.roomType=roomType
        self.roomLocation=""
        self.relatedRooms=relatedRooms
    
def referenceRows():
    row=[]
    for i in range(26):                         #0-25 think tanks
        roomName="Think Tank "+str(i+1)
        roomType="Think Tank"
        row.append(Room(roomName,roomType))
    for i in range(16):                         #26-41 Cohort Classrooms
        roomName="Cohort Classroom "+str(i+1)
        roomType="Cohort Classroom"
        row.append(Room(roomName,roomType))
    for i in range(5):                          #42-46 Lecture Theatres
        roomName="Lecture Theatre "+str(i+1)
        roomType="Lecture Theatre"
        row.append(Room(roomName,roomType))
    row.append(Room("Arms Lab 1,2","Lab"))      #47-51 Labs
    row.append(Room("Arms Lab 3","Lab"))
    row.append(Room("Digital System Lab","Lab"))
    row.append(Room("Data Analytics Lab","Lab"))
    row.append(Room("Computer Lab","Lab"))      
    row.append(Room("Think Tank 16,17","Tiered Think Tank",[15,16]))    #55-60 TTT, only include 6
    row.append(Room("Think Tank 7,8","Tiered Think Tank",[6,7]))
    row.append(Room("Think Tank 4,5","Tiered Think Tank",[3,4]))
    row.append(Room("Think Tank 11,12","Tiered Think Tank",[10,11]))
    row.append(Room("Think Tank 14,15","Tiered Think Tank",[13,14]))
    row.append(Room("Think Tank 9,10","Tiered Think Tank",[8,9]))
    for i in range(10):                         #61-70 capstones
        roomName="Capstone "+str(i+1)
        roomType="Capstone"
        row.append(Room(roomName,roomType))
        
    for i in range(71,249):
        row.append("")      #cohort classes and professors,71-120 class,121-249 prof
    return row
"""
Pre-loaded room list:
ISTD term4,5: cc13,cc14,Lt2,Lt3,dsl
ISTD term6,7,8: cc11,cc13,cc14,lt2,lt3,TT16,17,18
EPD term 4: arms lab1, LT2345, cc15,cc16
EPD term 5: arms lab1(30.007), LT2345,cc15,cc16,tt 15,dsl(30.102 EM)
EPD term 6,7,8: arms lab 3, LT2345,CC15,CC16,TT
ESD term4,5:cc13,lt3,lt4,lt5,tt9,tt10
HASS: cc11,cc13,cc14,tt6,7,8,9,10,11,12,16,17,18,23,24,ttt1617,ttt78,LT3,4,5,Lab:IDiaLab??
"""
def initializeValue():                      #initialize rooms, cohort list, professor list
    rowRef=referenceRows()
    global proNum
    global claNum
    ISTDterm45={"CC":[cc+12,cc+13],"LT":[lt+1,lt+2],"LAB":[lab+2]}    #pre-defined rooms for pillar and term
    ISTDterm678={"CC":[cc+10,cc+12,cc+13],"LT":[lt+1,lt+2],"TT":[tt+15,tt+16,tt+17],"TTT":[ttt],"LAB":[lab+2]}
    EPDterm45={"CC":[cc+14,cc+15],"LT":[lt+1,lt+2,lt+3,lt+4],"TT":[tt+14],"LAB":[lab,lab+2]}
    EPDterm678={"CC":[cc+14,cc+15,cc+16],"TT":[tt,tt+1,tt+2,tt+3,tt+4,tt+5],"LAB":[lab,lab+2],"TTT":[ttt+2]}
    ESDterm45={"CC":[cc+12],"LT":[lt+2,lt+3,lt+4],"TT":[tt+8,tt+9],"LAB":[lab+3]}
    ESDterm678={"CC":[cc+12],"LT":[lt+2,lt+3,lt+4],"TT":[tt+6,tt+7,tt+8,tt+9],"LAB":[lab+3],"TTT":[ttt+1]}
    Hass={"CC":[cc+10,cc+12,cc+13],"LT":[lt+2,lt+3,lt+4],"TT":[tt+6,tt+7,tt+8,tt+9,tt+10,tt+11,tt+15,tt+16,tt+17,tt+22,tt+23],"LAB":[lab+4],"TTT":[ttt,ttt+1]}
    for course in courses:
        pillarTerm=dict()
        if course.term in [4,5] and course.courseName[0]=="5":
            course.pillar="ISTD"
            pillarTerm=ISTDterm45
            claStart=cla
        elif course.term in [6,7,8] and course.courseName[0]=="5":
            course.pillar="ISTD"
            pillarTerm=ISTDterm678
            claStart=claNum
        elif course.term in [4,5] and course.courseName[0]=="3":
            course.pillar="EPD"
            pillarTerm=EPDterm45
            claStart=cla+4
        elif course.term in [6,7,8] and course.courseName[0]=="3":
            course.pillar="EPD"
            pillarTerm=EPDterm678
            claStart=claNum
        elif course.term in [4,5] and course.courseName[0]=="4":
            course.pillar="ESD"
            pillarTerm=ESDterm45
            claStart=cla+8
        elif course.term in [6,7,8] and course.courseName[0]=="4":
            course.pillar="ESD"
            pillarTerm=ESDterm678
            claStart=claNum
        elif course.courseName[1]=="2":#hass
            course.pillar="HASS"
            pillarTerm=Hass
            claStart=claNum
        for k in range(course.classes):
            rowRef[claStart]=k+1 
            course.classlist.append(claStart)
            claStart+=1
        if claStart-claNum==course.classes:
            claNum=claStart
        
        for k in range(len(course.sessions)):
            #comp=course.sessions[k]["preference"]
            classSize=course.size
            #if comp=="no preference":
            comp=course.sessions[k]["class_type"]
                
            course.sessions[k]["roomList"]=list()
            
            if comp=="Cohort Based Learning": 
                
                if classSize<=30:
                    course.sessions[k]["roomList"]=pillarTerm["TT"]+pillarTerm["CC"] 
                else:
                    course.sessions[k]["roomList"]=pillarTerm["CC"] 
                #print (pillarTerm["CC"])
            if comp=="Cohort Classroom":
                course.sessions[k]["roomList"]=pillarTerm["CC"]        
            if comp=="Think Tank":
                course.sessions[k]["roomList"]=pillarTerm["TT"]        
            if comp=="Tiered Think Tank":
                course.sessions[k]["roomList"]=pillarTerm["TTT"]        
            if comp=="Lab":
                course.sessions[k]["roomList"]=pillarTerm["LAB"]        
            if comp=="Lecture":
                if (classSize*course.classes<=60):
                    course.sessions[k]["roomList"]=pillarTerm["LT"]+pillarTerm["CC"]
                else:
                    course.sessions[k]["roomList"]=pillarTerm["LT"]         
                
            if comp=="Lecture Theatre":
                course.sessions[k]["roomList"]=pillarTerm["LT"]  
            lis=[]
            for prof in range(len(course.sessions[k]["instructors"])):
                newProfName=course.sessions[k]["instructors"][prof]+course.sessions[k]["instructor_ids"][prof]
                if newProfName not in rowRef:
                    lis.append(proNum)
                    rowRef[proNum]=newProfName
                    proNum+=1
                else:
                    lis.append(rowRef.index(newProfName))
            course.sessions[k]["proID"]=lis
            
    return rowRef

def timetableInitial():
    schedule = []
    temp=[]
    for i in range(5*19):
        temp.append(-1)
    for i in range(250):
        schedule.append(copy.deepcopy(temp))
    return schedule

def checkSchedule(schedule,objectID,i,j):
    for c in range(i,j):
        if schedule[objectID][c]!=-1: 
            return False
    return True

def checkAllSchedule(schedule,classList,profList,roomList,i,j):# return the room number if everything is satisfied, otherwise return -1
    if type(classList)==list:
        for classes in classList:
            if not checkSchedule(schedule,classes,i,j):
                return -1
    else:
        if not checkSchedule(schedule,classList,i,j):
            return -1
    for prof in profList:
        if not checkSchedule(schedule,prof,i,j):
            return -1
    selectedRoom=-1
    for room in roomList:
        if rowRef[room].roomType=="Tiered Think Tank":
            if checkSchedule(schedule,rowRef[room].relatedRooms[0],i,j) and checkSchedule(schedule,rowRef[room].relatedRooms[1],i,j):
                selectedRoom=room
                break
        else:
            if checkSchedule(schedule,room,i,j):
                selectedRoom=room
                break
    return selectedRoom
                    

def setSchedule(schedule,objectID,i,j,value):
    for c in range(i,j):
        schedule[objectID][c]=value
    return schedule

def setAllSchedule(schedule,classList,profList,room,i,j,value):
    if type(classList)==list:
        for classes in classList:
            schedule=setSchedule(schedule,classes,i,j,value)
    else:
        schedule=setSchedule(schedule,classList,i,j,value)
    for prof in profList:
        schedule=setSchedule(schedule,prof,i,j,value)
    if rowRef[room].roomType=="Tiered Think Tank":
        schedule=setSchedule(schedule,rowRef[room].relatedRooms[0],i,j,value) 
        schedule=setSchedule(schedule,rowRef[room].relatedRooms[1],i,j,value)
        schedule=setSchedule(schedule,room,i,j,value)
    else:
        schedule=setSchedule(schedule,room,i,j,value)
    return schedule
    

class Course(object):
    def __init__(self,name,boolean,num_of_sessions,term,classes,studentSize):
        self.courseName = name
        self.courseType = int(boolean)
        self.numSessions = int(num_of_sessions)
        self.term=int(term)
        self.sessions=[]
        self.classes=int(classes)
        self.size=int(studentSize)
        self.classlist=[]
        self.priority = 0
        self.finish=False
    def setPriority(self,c1,c2,c3,c4):
        if self.courseType: 
            j=2
        else:
            j=1
        lec = 0
        for i in self.sessions:
            if i["class_type"]=="Lecture":
                lec+=1
        self.priority= j*c1+self.numSessions*c2+self.classes*c3+lec*c4

def capstoneInitial(schedule):
    global claNum
    profList=[pro,pro+3,pro+5] #sudipta,datta,alex
    for prof in profList:
        schedule=setSchedule(schedule,prof,64,70,"Capstone")  #every Thursday 12pm to 3pm
        schedule=setSchedule(schedule,prof,32,38,"Capstone")  #every Tuesday 3pm to 6pm
    for classes in range(83,claNum):
        schedule=setSchedule(schedule,classes,64,70,-500)  #block the same timing for all term7,8 students
        schedule=setSchedule(schedule,classes,32,38,-500)  
    return schedule
    
    
def generator(c1,c2,c3,c4):
    global term78
    normalDayTime=[[0,12],[25,37],[38,47],[57,69],[76,85]]    #The available slots for every day
    seniorDayTime=[[0,12],[25,31],[38,47],[57,62],[76,85]]
    hassDayTime=[[13,18],[19,24],[],[70,75],[76,85]]
    sequence=[]
    for i in courses:
        i.setPriority(c1,c2,c3,c4)
    for i in range(len(courses)):
        sequence.append((courses[i].priority,i))
    sor=sorted(sequence)
    newSche=timetableInitial()
    if not term78==-1:
        newSche = capstoneInitial(newSche)
        
    for c in sor:
        count=c[1]
        i = courses[count].numSessions
        classlist= courses[count].classlist
        classRanCheck=[]
        if courses[count].pillar=="HASS":
            dayTime=hassDayTime
        elif courses[count].term in [7,8]:
            dayTime=seniorDayTime
        else:
            dayTime=normalDayTime
        for k in range(len(classlist)):
            classRanCheck.append(0)
        for l in range(i):
            clength=int(float(courses[count].sessions[l]["time"])*2)
            if courses[count].sessions[l]["class_type"]=="Cohort Based Learning"or courses[count].sessions[l]["class_type"]=="Lab":
                classCheck=copy.deepcopy(classlist)
                for num in range(len(classlist)):
                    randomClass=classCheck[random.randint(0,len(classCheck)-1)]
                    randomDay = classRanCheck[classlist.index(randomClass)]
                    while (True):
                        if randomDay>4:
                            newSche[0][0]="Fail"
                            return newSche
                        succ = False
                        if dayTime[randomDay]==[]:
                            randomDay+=1
                            continue
                        for newtime in range(dayTime[randomDay][0],dayTime[randomDay][1]-clength+2):
                            roomID=checkAllSchedule(newSche,randomClass,courses[count].sessions[l]["proID"],courses[count].sessions[l]["roomList"],newtime,newtime+clength)
                            if roomID==-1:
                                continue
                            else:
                                succ=True
                                value=count*10+l#Course Number+course session
                                newSche=setAllSchedule(newSche,randomClass,courses[count].sessions[l]["proID"],roomID,newtime,newtime+clength,value)
                                classRanCheck[classlist.index(randomClass)]=randomDay+1
                                            
                                break
                        if succ:
                            classCheck.remove(randomClass)
                            break
                        randomDay+=1
            elif courses[count].sessions[l]["class_type"]=="Lecture":
                maxi=0
                for j in range(len(classlist)):
                    if classRanCheck[j]>maxi:
                        maxi=classRanCheck[j]
                randomDay=maxi        
                while (True):
                    succ=False
                    if randomDay>4:
                        newSche[0][0]="Fail"
                        return newSche
                    for newtime in range(dayTime[randomDay][0],dayTime[randomDay][1]-clength+2):
                        roomID=checkAllSchedule(newSche,classlist,courses[count].sessions[l]["proID"],courses[count].sessions[l]["roomList"],newtime,newtime+clength)
                        if roomID==-1:
                            continue
                        else:
                            succ=True
                            value=count*10+l
                            newSche=setAllSchedule(newSche,classlist,courses[count].sessions[l]["proID"],roomID,newtime,newtime+clength,value)
                            for randomClass in range(len(classlist)):
                                classRanCheck[randomClass]=randomDay+1
                            break
                    if succ:
                        break
                    randomDay+=1
        
    return newSche
##checkScore: check for the score of the current Schedule
##output the index of the schedules with minimum score
def checkScore():
    minScore=[]
    for i in range(10):
        currentScore=0
        for time in range(95):
            summ=[]
            for row in range(250):
                if type(rawSchedules[i][row][time])==str:
                    continue
                if rawSchedules[i][row][time]!=-1 and rawSchedules[i][row][time]!=-500 :
                    if (rawSchedules[i][row][time] not in summ):
                        summ.append(rawSchedules[i][row][time])
            currentScore+=len(summ)        
            for course in summ:
                if courses[course//10].term in [4,5]:
                    currentScore-=0.7
            
        minScore.append((currentScore,i))
    output=[]
    count=0
    #print(minScore)
    for i in sorted(minScore):
        output.append(i[1])
        count+=1
        if count==10:break
    return output,minScore[0][0]
##mutation: input: a list of 10 indexes with minimum score
def randomLunchGenerator():
    pass

def mutation(lis):    
    output=[]   #
    for i in lis:
        for j in lis:
            newParams=[]
            for k in range(6):
                r=random.randint(0,1)
                if r==0:
                    newParams.append(rawParams[i][k])
                else:
                    newParams.append(rawParams[j][k])
            output.append(newParams)
    return output
def formatOutput(schedule):
    global courses
    global rowRef
    prof=pro

    while rowRef[prof]!="":
        #print(rowRef[prof],":")
        for day in range(5):
            time=int(0)
            while (time<19):
                realTime=int(day*19+time)
                if schedule[prof][realTime]!=-1 and schedule[prof][realTime]!=-500:
                    if type(schedule[prof][realTime])==str:
                        profName,profID,proEmpty=re.split('(\d+)',rowRef[prof])
                        print("{\"term\":\""+str(term78)+"\",\"pillar\":\"Capstone\",\"course\":\"Capstone\",\"prof\":\""+profName+"\",\"prof_id\":\""+profID+"\",\"cohort\":\"1\"" #what cohort to put?
                          +"\",\"location\":\"Capstone\",\"day\":\""+str(day+1)+"\",\"start\":\""+str(int(time))+
                          "\",\"end\":\""+str(int(time+5)) + "\"}")
                        time+=6
                    else:
                        courseNum=schedule[prof][realTime]//10
                        sessionNum=schedule[prof][realTime]%10
                        if courses[courseNum].sessions[sessionNum]["class_type"]=="Lecture":
                                
                            classNum=courses[courseNum].classes
                            if classNum==1:
                                classStr="1"
                            elif classNum==2:
                                classStr="1,2"
                            elif classNum==3:
                                classStr="1,2,3"
                            elif classNum==4:
                                classStr="1,2,3,4"
                            
                        else:
                            clas=cla
                            while (schedule[clas][realTime]!=schedule[prof][realTime]):
                                clas+=1
                            #print(clas,rowRef[clas])
                            classStr=str(rowRef[clas])
                                
                        for room in courses[courseNum].sessions[sessionNum]["roomList"]:
                            if schedule[prof][realTime]==schedule[room][realTime]:
                                roos=room
                                break
                        startTime=int(time)
                        endTime=int(time+float(courses[courseNum].sessions[sessionNum]["time"])*2-1)
                        profName,profID,proEmpty=re.split('(\d+)',rowRef[prof])
                        print("{\"term\":\""+str(courses[courseNum].term)+"\",\"pillar\":\""+courses[courseNum].pillar+"\",\"course\":\""+courses[courseNum].courseName+"\",\"prof\":\""+profName+"\",\"prof_id\":\""+profID+"\",\"cohort\":\""
                          +classStr+"\",\"location\":\""+str(rowRef[roos].roomName)+"\",\"day\":\""+str(day+1)+"\",\"start\":\""+str(startTime)+
                          "\",\"end\":\""+str(endTime) + "\"}")
                        time=endTime+1
                    sys.stdout.flush()
                else:
                    time+=1
            
        
        prof+=1

"""
main function
"""
start = time.time()
courses = readJson("https://api.myjson.com/bins/h2c9v")
start1 = time.time()
rowRef=referenceRows()
rowRef=initializeValue()


dayTime=[[0,12],[25,37],[38,47],[57,69],[76,81]]    #The available slots for every day

rawSchedules = []
rawParams=[]
for i in range(10):
    while(True):
        proNum=100
        claNum=53
        randBreak1=random.randint(5,10)     #random break 30mins for monday
        randBreak2=random.randint(62,67)         #random break 30mins for Thursday
        param1,param2,param3,param4=random.randint(1,10),random.randint(1,10),random.randint(1,10),random.randint(1,10)
        currentSchedule=generator(param1,param2,param3,param4)
        if currentSchedule[0][0]!="Fail":
            break
        
    rawSchedules.append(currentSchedule)
    rawParams.append([param1,param2,param3,param4,randBreak1,randBreak2])
for i in range(5):
    index,score=checkScore()
    rawParams=mutation(index)
    rawSchedule=[]
    for j in range(10):
        while(True):
            proNum=100
            claNum=53
            currentSchedule=generator(rawParams[j][0],rawParams[j][1],rawParams[j][2],rawParams[j][3])
            if currentSchedule[0][0]!="Fail":
                #print("yes")
                break
        rawSchedule.append(currentSchedule)
    #print("at the loop no.: ",i,"Score is ",score)
index,score=checkScore()
formatOutput(rawSchedule[index[0]])

end=time.time()    
#print(end-start,end-start1)

#print(score)
            
    

     
