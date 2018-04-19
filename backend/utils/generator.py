# -*- coding: utf-8 -*-
"""
Created on Thu Apr 12 05:01:39 2018

@author: Rafaela
"""


import json
from urllib.request import urlopen
import random
import copy
import time
import re
import sys
tt,cc,lt,lab,ttt,capstone,cla,pro=0,26,42,47,55,61,71,121 # the global constant for row Reference table, represent think tank, Cohort classroom ... cla=the start of Classes, pro= the start of profs
proNum=121                                                  # mark the end of existing prof list 
claNum=83                                                   # mark the end of term 6,7,8 classes 
CapstoneNum=-1                                              # record the course id of the capstone, -1 if no capstone is included
seniorCourse=[]                                             # a list of all term 6/7/8 courses. randomly 
def readJson():
    global CapstoneNum
    weather = sys.argv[1]
    wjson = json.loads(weather)                             # the json data is passed as the system argv
    courses=[]
    i=0
    newCourse=[]                                            #store the term678 courses
    for key,value in wjson.items():
        courses.append(Course(value["course_no"],value["core"],len(value["sessions"]),value["term"],value["no_classes"],value["class_size"],value["pillar"]))
        courses[i].sessions=value["sessions"]
        if courses[i].courseName=="01.400":                 #check if it is capstone
            CapstoneNum=i
        elif courses[i].term in [6,7,8]:
            newCourse.append(i)
        i+=1
    return courses,newCourse

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
    row.append(Room("Think Tank 16,17","Linked Think Tank",[15,16]))    #55-60 Linked Think Tanks, to support a 50 people module in think tank
    row.append(Room("Think Tank 7,8","Linked Think Tank",[6,7]))
    row.append(Room("Think Tank 4,5","Linked Think Tank",[3,4]))
    row.append(Room("Think Tank 11,12","Linked Think Tank",[10,11]))
    row.append(Room("Think Tank 14,15","Linked Think Tank",[13,14]))
    row.append(Room("Think Tank 9,10","Linked Think Tank",[8,9]))
    for i in range(10):                         #61-70 capstones
        roomName="Capstone "+str(i+1)
        roomType="Capstone"
        row.append(Room(roomName,roomType))
        
    for i in range(71,300):
        row.append("")      #cohort classes and professors,71-120 class,121-249 prof
    return row

def initializeValue():                      #initialize rooms, cohort list, professor list
    rowRef=referenceRows()
    global proNum
    global claNum
    LinkedThinkTank=[ttt,ttt+1,ttt+2,ttt+3]
    ISTDterm45={"CC":[cc+12,cc+13],"LT":[lt+1,lt+2],"LAB":[lab+2],"TT":[tt+15,tt+16,tt+17],"TTT":[tt+23,tt+24]}    #pre-defined rooms for pillar and term
    ISTDterm678={"CC":[cc+10,cc+12,cc+13],"LT":[lt+1,lt+2,lt+3,lt+4],"TT":[tt+15,tt+16,tt+17],"TTT":[tt+23,tt+24],"LAB":[lab+2]}
    EPDterm45={"CC":[cc+14,cc+15],"LT":[lt+1,lt+2,lt+3,lt+4],"TT":[tt,tt+1,tt+2,tt+3,tt+4,tt+5,tt+6,tt+7,tt+8,tt+9],"LAB":[lab,lab+2],"TTT":[tt+21,tt+22]}
    EPDterm678={"CC":[cc+10,cc+14,cc+15],"LT":[lt+1,lt+2,lt+3,lt+4],"TT":[tt,tt+1,tt+2,tt+3,tt+4,tt+5,tt+6,tt+7,tt+8,tt+9],"LAB":[lab,lab+2,lab+3],"TTT":[tt+21,tt+22,tt+23,tt+24]}
    ESDterm45={"CC":[cc+10,cc+9],"LT":[lt+2,lt+3,lt+4],"TT":[tt+10,tt+11,tt+12,tt+13,tt+14,tt+15],"LAB":[lab+3],"TTT":[tt+18,tt+19]}
    ESDterm678={"CC":[cc+10,cc+9],"LT":[lt+2,lt+3,lt+4],"TT":[tt+10,tt+11,tt+12,tt+13,tt+14,tt+15],"LAB":[lab+3],"TTT":[tt+18,tt+19,tt+20]}
    Hass={"CC":[cc+10,cc+12,cc+13],"LT":[lt+2,lt+3,lt+4],"TT":[tt,tt+1,tt+2,tt+3,tt+4,tt+5,tt+6,tt+7,tt+8,tt+9,tt+10,tt+11,tt+15,tt+16,tt+17],"LAB":[lab+4],"TTT":[tt+18,tt+19,tt+20,tt+21,tt+22]}
    for course in courses:
        pillarTerm=dict()
        if course.term in [4,5] and course.courseName[0]=="5":
            pillarTerm=ISTDterm45
            claStart=cla
        elif course.term in [6,7,8] and course.courseName[0]=="5":
            pillarTerm=ISTDterm678
            claStart=claNum
        elif course.term in [4,5] and course.courseName[0]=="3":
            pillarTerm=EPDterm45
            claStart=cla+4
            
        elif course.term in [6,7,8] and course.courseName[0]=="3":
            pillarTerm=EPDterm678
            claStart=claNum
        elif course.term in [4,5] and course.courseName[0]=="4":
            pillarTerm=ESDterm45
            claStart=cla+8
        elif course.term in [6,7,8] and course.courseName[0]=="4":
            pillarTerm=ESDterm678
            claStart=claNum
        elif course.pillar=="HASS" or course.pillar=="Tech Elective":#hass and tech elective share the same rooms
            pillarTerm=Hass
            claStart=claNum
        elif course.courseName=="01.400":                           #for capstones, consider all capstone rooms must be empty, only check for profs
            lis=[]
            for prof in range(len(course.sessions[0]["instructors"])):
                newProfName=course.sessions[0]["instructors"][prof]+course.sessions[0]["instructor_ids"][prof]
                if newProfName not in rowRef:                       #all profs are recorded as profname+prof id
                    lis.append(proNum)
                    rowRef[proNum]=newProfName
                    proNum+=1
                else:
                    lis.append(rowRef.index(newProfName))
            course.sessions[0]["proID"]=lis                         #add to the course list
            
            continue
        for k in range(course.classes):
            rowRef[claStart]=k+1 
            course.classlist.append(claStart)
            claStart+=1
        if claStart-claNum==course.classes:
            claNum=claStart
        for k in range(len(course.sessions)):
            comp=course.sessions[k]["preference"]
            classSize=course.size
            if comp=="No preference":                                   #follow the class type if there is no preference from the instructor
                comp=course.sessions[k]["class_type"]
            course.sessions[k]["roomList"]=list()
            if comp=="Cohort Based Learning": 
                if classSize<=30:
                    course.sessions[k]["roomList"]=pillarTerm["TT"]+pillarTerm["CC"] 
                else:
                    course.sessions[k]["roomList"]=pillarTerm["CC"] 
            if comp=="Cohort Classroom":
                course.sessions[k]["roomList"]=pillarTerm["CC"]        
            if comp=="Think Tank":
                if classSize<=30:
                    course.sessions[k]["roomList"]=pillarTerm["TT"]
                else:
                    course.sessions[k]["roomList"]=LinkedThinkTank 
                    
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

def timetableInitial(b1,b2):                                #initialize the timetable with two lunch breaks
    schedule = []
    temp=[]
    for i in range(5*19):
        temp.append(-1)                                     #available = -1, lunch break = -500
    temp[b1]=-500
    temp[b2]=-500
    for i in range(300):
        schedule.append(copy.deepcopy(temp))
    return schedule

def checkSchedule(schedule,objectID,i,j):                   #check for the availability of the schedule of row objectID from time i to time j
    for c in range(i,j):
        if schedule[objectID][c]!=-1: 
            return False
    return True

def checkAllSchedule(schedule,classList,profList,roomList,i,j):# check availability for class, profs and rooms. return the room number if everything is satisfied, otherwise return -1
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
        if rowRef[room].roomType=="Linked Think Tank":
            if checkSchedule(schedule,rowRef[room].relatedRooms[0],i,j) and checkSchedule(schedule,rowRef[room].relatedRooms[1],i,j):
                selectedRoom=room
                break
        else:
            if checkSchedule(schedule,room,i,j):
                selectedRoom=room
                break
    return selectedRoom
                    

def setSchedule(schedule,objectID,i,j,value):                       #set the schedule of row objectID from time i to time j to be certain value
    for c in range(i,j):
        schedule[objectID][c]=value
    return schedule

def setAllSchedule(schedule,classList,profList,room,i,j,value):     #set the schedule of all classes, profs and room involved to be certain value
    if type(classList)==list:
        for classes in classList:
            schedule=setSchedule(schedule,classes,i,j,value)
    else:
        schedule=setSchedule(schedule,classList,i,j,value)
    for prof in profList:
        schedule=setSchedule(schedule,prof,i,j,value)
    if rowRef[room].roomType=="Linked Think Tank":
        schedule=setSchedule(schedule,rowRef[room].relatedRooms[0],i,j,value) 
        schedule=setSchedule(schedule,rowRef[room].relatedRooms[1],i,j,value)
        schedule=setSchedule(schedule,room,i,j,value)
    else:
        schedule=setSchedule(schedule,room,i,j,value)
    return schedule
    

class Course(object):                                                           # store the information for each course
    def __init__(self,name,boolean,num_of_sessions,term,classes,studentSize,pillar):
        self.courseName = name # e.g 50.001
        self.courseType = int(boolean) # core or elective
        self.numSessions = int(num_of_sessions) 
        self.term=int(term)
        self.sessions=[] # a list of information stored in dictionary
        self.classes=int(classes) # number of classes
        self.size=int(studentSize) # the size of each class
        self.classlist=[] # define in initializeValue()
        self.priority = 0
        self.pillar=pillar
    def setPriority(self,c1,c2,c3,c4): #set the priority of the course based on the 4 parameters
        if self.courseType: 
            j=2
        else:
            j=1
        lec = 0
        for i in self.sessions:
            if i["class_type"]=="Lecture":
                lec+=1
        self.priority= -(j*c1+self.numSessions*c2+self.classes*c3+lec*c4)       # priority = c1*core+c2*number of sessions+ c3* number of classes + c4* number of lectures. use negative to inverse the order

def capstoneInitial(schedule,cap):                                              # initialize the capstion schedule with courseID cap (capstone)
    global claNum
    profList=courses[cap].sessions[0]["proID"]
    for prof in profList:
        schedule=setSchedule(schedule,prof,64,70,"Capstone")  #every Thursday 12pm to 3pm
        schedule=setSchedule(schedule,prof,32,38,"Capstone")  #every Tuesday 3pm to 6pm
    for classes in range(83,claNum):
        schedule=setSchedule(schedule,classes,64,70,-500)  #block the same timing for all term7,8 students
        schedule=setSchedule(schedule,classes,32,38,-500)  
    return schedule
    
    
def generator(c1,c2,c3,c4,b1,b2,seniorCourse):                                  # main generator function, takes in 4 params for priority, 2 params for lunch break and 1 term678 course list
    global CapstoneNum
    normalDayTime=[[0,12],[25,37],[38,47],[57,69],[76,85]]                      # The available slots for every day
    seniorDayTime=[[0,12],[25,31],[38,47],[57,62],[76,85]]                      # The available slots for term 7,8 student with capstone
    hassDayTime=[[13,18],[19,24],[],[70,75],[76,85]]                            # The available slots for hass courses
    sequence=[]
    for i in courses:                                                           # set the priority of the courses and sort them
        i.setPriority(c1,c2,c3,c4)
    for i in range(len(courses)):
        sequence.append((courses[i].priority,i))
    sor=sorted(sequence)
    newSche=timetableInitial(b1,b2)                                             # initialize the timetable
    if CapstoneNum!=-1:
        newSche = capstoneInitial(newSche,CapstoneNum)
    Classlist=newClassList(seniorCourse)                                        # group the first class of every three term678 courses together.
    for c in sor:                                                               # loop through all the sorted courses
        
        count=c[1]
        if courses[count].courseName=="01.400":                                 # jump if it reaches capstone course
            continue
        i = courses[count].numSessions
        classlist= Classlist[count]
        classRanCheck=[]
        if courses[count].pillar=="HASS":                                       # set the available timeslots
            dayTime=hassDayTime
        elif courses[count].term in [7,8]:
            dayTime=seniorDayTime
        else:
            dayTime=normalDayTime
        for k in range(len(classlist)):                                         # store the day of the last session of each class
            classRanCheck.append(0)
        for l in range(i):
            clength=int(float(courses[count].sessions[l]["time"])*2)            # length of the class is time*2 (30 minutes for 1 slot)
            if courses[count].sessions[l]["class_type"]=="Cohort Based Learning"or courses[count].sessions[l]["class_type"]=="Lab":
                classCheck=copy.deepcopy(classlist)                             
                for num in range(len(classlist)):                               # for labs and CBL, each class attend the session individually. Go through all the class involved to check availability
                    randomClass=classCheck[random.randint(0,len(classCheck)-1)] # randomly pick a class to start
                    randomDay = classRanCheck[classlist.index(randomClass)]     
                    while (True):
                        if randomDay>4:                                         # if it overflows, return fail
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
                                value=count*10+l                                # value = Course Number"+"course session.
                                newSche=setAllSchedule(newSche,randomClass,courses[count].sessions[l]["proID"],roomID,newtime,newtime+clength,value) #block the timing
                                classRanCheck[classlist.index(randomClass)]=randomDay+1
                                            
                                break
                        if succ:
                            classCheck.remove(randomClass)
                            break
                        randomDay+=1
            elif courses[count].sessions[l]["class_type"]=="Lecture":
                maxi=0
                for j in range(len(classlist)):                                 # for lectures, all classes must attend at the same time. 
                    if classRanCheck[j]>maxi:                                   # get the first available timeslot for all classes to finish previous sessions
                        maxi=classRanCheck[j]
                randomDay=maxi        
                while (True):
                    succ=False
                    if randomDay>4:
                        newSche[0][0]="Fail"
                        return newSche
                    for newtime in range(dayTime[randomDay][0],dayTime[randomDay][1]-clength+2): #check availability of all classes, profs and rooms involved
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
##randomPillar: take in a list or course names
##output in random sequence
def randomPillar(lis):
    newlis=[]
    i=0
    while(i<len(lis)):
        rand=random.randint(0,len(lis)-1)
        if lis[rand] not in newlis:
            newlis.append(lis[rand])
            i+=1
            
    return newlis
##newClassList: take in the pillar list(size n),refer to the course list(size m)
##output a list of m sublists, each contains the classes(rowRef) for the course
def newClassList(lis):
    
    newlis=[]
    liscount=0
    for i in range(len(courses)):
        if courses[i].courseName=="01.400":     # jump the capstone course
            newlis.append([])
        else:
            if i in lis:
                liss=list()
                liss.append(courses[lis[liscount//3*3]].classlist[0])
                liss.extend(courses[i].classlist[1:])
                newlis.append(liss)
                liscount+=1                    
            else:
                newlis.append(courses[i].classlist)
    return newlis
##checkScore: check for the score of the current Schedule
##output the index of the schedules with minimum score
def checkScore(rawSchedule):
    global proNum,cla,claNum
    minScore=[]
    for i in range(len(rawSchedule)):
        currentScore=0
        for time in range(95):
            if time in [13,24] or time in [70,85]:# dont need to check for hass, it will always clash
                continue
            summ=[]
            for row in range(cla,claNum):
                if type(rawSchedule[i][row][time])==str:
                    continue
                if rawSchedule[i][row][time]!=-1 and rawSchedule[i][row][time]!=-500 :
                    if (rawSchedule[i][row][time] not in summ):                 # record the courses 
                        summ.append(rawSchedule[i][row][time])
            #currentScore+=len(summ)        
            term4=0
            term6=0
            for course in summ:                                                 # record clash if term 5&7, term 4&6 courses clashes
                if courses[course//10].term in [4,5]:
                    term4+=1
                else:
                    term6+=1
            if (term4>0 and term6>0):
                currentScore+=term6
            
        minScore.append((currentScore,i))
    output=[]
    count=0
    for i in sorted(minScore):                                                  # output the top 9 schedule index and the minimum score
        output.append(i[1])
        count+=1
        if count==9:break
    return output,minScore[0][0]

## save the params
def saveParams(index,rawParams):
    params=[]
    for i in index:
        params.append(copy.deepcopy(rawParams[i]))
    return params

##mutation: input: a list of 9 indexes with minimum scores, the param list
##output the 81 crossover param list
def mutation(lis,rawParams):    
    output=[]   
    for i in lis:
        for j in lis:
            newParams=[]
            for k in range(6):                                                  # for the first 6 params, choose either i or j's param
                r=random.randint(0,1)
                if r==0:
                    newParams.append(rawParams[i][k])
                else:
                    newParams.append(rawParams[j][k])
            
            if (len(rawParams[i][6])<=4):                                       # dont mutate if the only 4 term6,7,8 courses are available
                
                newParams.append(rawParams[i][6])
            else:
                r=random.randint(0,len(rawParams[i][6])-1)

                jvalue=rawParams[j][6][r]                                       # cross over for the term 6,7,8 courses
                newlist=copy.deepcopy(rawParams[i][6])
                newlist.remove(jvalue)
                newlist.insert(r,jvalue)
                newParams.append(newlist)
            output.append(newParams)
    return output
## format the json output
def formatJson(term,pillar,course,prof,profid,cohort,location,day,start,end):
    response = {}
    response["term"] = term
    response["pillar"] = pillar
    response["course"] = course
    response["prof"] = prof
    response["prof_id"] = profid
    response["cohort"] = cohort
    response["location"] = location
    response["day"] = day
    response["start"] = start
    response["end"] = end
    print(json.dumps(response) + ",")
    sys.stdout.flush()
## takes in 3, output "1,2,3"
def intToString(num):
    s="1"
    if num==1:
        return s
    else:
        for i in range(num-1):
            s=s+","+str(i+2)
    return s

##format Output: takes in schedule and output the corresponding time stamps
def formatOutput(schedule):
    global courses
    global rowRef,CapstoneNum
    prof=pro

    while rowRef[prof]!="":                                                     # go through all the profs in the reference table
        for day in range(5):
            time=int(0)
            while (time<19):
                realTime=int(day*19+time)
                if schedule[prof][realTime]!=-1 and schedule[prof][realTime]!=-500:
                    if type(schedule[prof][realTime])==str:                     # only capstone is stored as string
                        
                        
                        profName,profID,proEmpty=re.split('(\d+)',rowRef[prof])
                        formatJson(str(courses[CapstoneNum].term),"Capstone","01.400",profName,profID,intToString(courses[CapstoneNum].classes),"Capstone",str(day+1),str(int(time)),str(int(time+5)))
                        time+=6
                    else:                                                       # normal courses
                        courseNum=schedule[prof][realTime]//10
                        sessionNum=schedule[prof][realTime]%10
                        if courses[courseNum].sessions[sessionNum]["class_type"]=="Lecture": #output all classes together for lectures
                                
                            classNum=courses[courseNum].classes
                            classStr=intToString(courses[courseNum].classes)                            
                        else:                                                   # output the specfic class involved for CBL and Lab
                            clas=cla
                            while (schedule[clas][realTime]!=schedule[prof][realTime]):
                                clas+=1
                            classStr=str(rowRef[clas])
                                
                        for room in courses[courseNum].sessions[sessionNum]["roomList"]: # find the corresponding room
                            if schedule[prof][realTime]==schedule[room][realTime]:
                                roos=room
                                break
                        startTime=int(time)
                        endTime=int(time+float(courses[courseNum].sessions[sessionNum]["time"])*2-1)
                        profName,profID,proEmpty=re.split('(\d+)',rowRef[prof])
                        formatJson(str(courses[courseNum].term),courses[courseNum].pillar,courses[courseNum].courseName,profName,
                                   profID,classStr,str(rowRef[roos].roomName),str(day+1),str(startTime),str(endTime))
                        time=endTime+1
                else:
                    time+=1
        prof+=1

"""
main function
"""
courses,seniorCourse = readJson()                                               # read json file
rowRef=referenceRows()                                                          # initialize row reference table
rowRef=initializeValue()


rawSchedules = []
rawParams=[]
lastTime=time.time()
currentTime=lastTime
for i in range(90):                                                             # generate 90 schedules in the first round with random parameters
    while(True):
        seniorCourse=randomPillar(seniorCourse)
        randBreak1=random.randint(5,10)     #random break 30mins for monday
        randBreak2=random.randint(62,67)         #random break 30mins for Thursday
        param1,param2,param3,param4=random.randint(1,10),random.randint(1,10),random.randint(1,10),random.randint(1,10)
        currentSchedule=generator(param1,param2,param3,param4,randBreak1,randBreak2,seniorCourse)
        if currentSchedule[0][0]!="Fail":
            lastTime=currentTime
            break
        currentTime=time.time()
        if (currentTime-lastTime>30):                                           # error handling
            raise ValueError("First round  takes more than 30 seconds")

    rawSchedules.append(currentSchedule)
    rawParams.append([param1,param2,param3,param4,randBreak1,randBreak2,seniorCourse])

lastTime=time.time()
if (lastTime-start1>5*60):                                                      # error handling
    raise ValueError("First round takes more than 5 minutes in total")

currentTime=lastTime
index,score=checkScore(rawSchedules)
newlist=saveParams(index,rawSchedules)
newlist1=saveParams(index,rawParams)
rawParams=mutation(index,rawParams)

for i in range(5):                                                              # generate 81 schedules for the next 5 rounds, each time use the previously generated param list
    rawSchedule=[]
    newParams=[]
    for j in range(81):
        while(True):
            currentSchedule=generator(rawParams[j][0],rawParams[j][1],rawParams[j][2],rawParams[j][3],rawParams[j][4],rawParams[j][5],rawParams[j][6])
            if currentSchedule[0][0]!="Fail":
                lastTime=currentTime
                newParams.append(rawParams[j])
                rawSchedule.append(currentSchedule)
                break
            currentTime=time.time()
            if (currentTime-lastTime>10):
                #print("Took more than 10 seconds to generate one schedule in the",i,"round, delete this")
                break
        #print(j)
    newlist.extend(rawSchedule)
    newlist1.extend(newParams)
    index,score=checkScore(newlist)
    if (i==4):                                                                  # if it reaches the last round, no need for mutation
        break
    rawParams=mutation(index,newlist1)
    newlist1=saveParams(index,newlist1)
    newlist=saveParams(index,newlist)
    
formatOutput(rawSchedule[index[0]])                                             # output the schedule in json format

    

     
