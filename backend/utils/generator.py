# -*- coding: utf-8 -*-
"""
Created on Thu Apr 12 05:01:39 2018

@author: trying
"""

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
CapstoneNum=-1 #become 7 or 8 if there is term7 or 8
seniorCourse=[]
def readJson(url):
    global CapstoneNum
    #weather = urlopen(url)
    weather = sys.argv[1]
    wjson = json.loads(weather)
    courses=[]
    i=0
    newCourse=[]#store the term678 courses
    for key,value in wjson.items():
    #for value in wjson:
        courses.append(Course(value["course_no"],value["core"],len(value["sessions"]),value["term"],value["no_classes"],value["class_size"],value["pillar"]))
        courses[i].sessions=value["sessions"]
        if courses[i].courseName=="01.400":
            CapstoneNum=i
        elif courses[i].term in [6,7,8]:
            newCourse.append(i)
        i+=1
    #print(newCourse)
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
    row.append(Room("Think Tank 16,17","Linked Think Tank",[15,16]))    #55-60 TTT, only include 6
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
"""
Pre-loaded room list:
TTT: tt19,20,21,22,23,24,25,26
ISTD term4,5: cc13,cc14,Lt2,Lt3,dsl,tt,ttt
ISTD term6,7,8: cc11,cc13,cc14,lt2,lt3,lt4,TT16,17,18
EPD term 4: arms lab1, LT2345, cc15,cc16,tt
EPD term 5: arms lab1(30.007), LT2345,cc15,cc16,tt1-10,dsl(30.102 EM)
EPD term 6,7,8: arms lab 3, LT2345,CC15,CC16,TT
ESD term4,5:cc13,lt3,lt4,lt5,tt10-15,lab,
HASS: cc11,cc13,cc14,tt1-17,ltt1617,ltt78,LT3,4,5,Lab:IDiaLab??
TECHELECT:same as hass
"""
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
        elif course.courseName=="01.400":
            lis=[]
            for prof in range(len(course.sessions[0]["instructors"])):
                newProfName=course.sessions[0]["instructors"][prof]+course.sessions[0]["instructor_ids"][prof]
                if newProfName not in rowRef:
                    lis.append(proNum)
                    rowRef[proNum]=newProfName
                    proNum+=1
                else:
                    lis.append(rowRef.index(newProfName))
            course.sessions[0]["proID"]=lis
            
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
            if comp=="No preference":
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
            #print(course.courseName,course.sessions[k]["roomList"])
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
            #if (course.pillar=="Tech Elective"):
            #    print (k,course.sessions[k]["proID"],"room",course.sessions[k]["roomList"])
            
    return rowRef

def timetableInitial(b1,b2):
    schedule = []
    temp=[]
    for i in range(5*19):
        temp.append(-1)
    temp[b1]=-500
    temp[b2]=-500
    for i in range(300):
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
        if rowRef[room].roomType=="Linked Think Tank":
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
    if rowRef[room].roomType=="Linked Think Tank":
        schedule=setSchedule(schedule,rowRef[room].relatedRooms[0],i,j,value) 
        schedule=setSchedule(schedule,rowRef[room].relatedRooms[1],i,j,value)
        schedule=setSchedule(schedule,room,i,j,value)
    else:
        schedule=setSchedule(schedule,room,i,j,value)
    return schedule
    

class Course(object):
    def __init__(self,name,boolean,num_of_sessions,term,classes,studentSize,pillar):
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
        self.pillar=pillar
    def setInstructors(self,ins):    
        self.instructors=ins
    def setPriority(self,c1,c2,c3,c4):
        if self.courseType: 
            j=2
        else:
            j=1
        lec = 0
        for i in self.sessions:
            if i["class_type"]=="Lecture":
                lec+=1
        self.priority= -(j*c1+self.numSessions*c2+self.classes*c3+lec*c4)

def capstoneInitial(schedule,cap):
    global claNum
    profList=courses[cap].sessions[0]["proID"] 
    for prof in profList:
        schedule=setSchedule(schedule,prof,64,70,"Capstone")  #every Thursday 12pm to 3pm
        schedule=setSchedule(schedule,prof,32,38,"Capstone")  #every Tuesday 3pm to 6pm
    for classes in range(83,claNum):
        schedule=setSchedule(schedule,classes,64,70,-500)  #block the same timing for all term7,8 students
        schedule=setSchedule(schedule,classes,32,38,-500)  
    return schedule
    
    
def generator(c1,c2,c3,c4,b1,b2,seniorCourse):
    global CapstoneNum
    normalDayTime=[[0,12],[25,37],[38,47],[57,69],[76,85]]    #The available slots for every day
    seniorDayTime=[[0,12],[25,31],[38,47],[57,62],[76,85]]
    hassDayTime=[[13,18],[19,24],[],[70,75],[76,85]]
    sequence=[]
    for i in courses:
        i.setPriority(c1,c2,c3,c4)
    for i in range(len(courses)):
        sequence.append((courses[i].priority,i))
    sor=sorted(sequence)
    newSche=timetableInitial(b1,b2)
    if CapstoneNum!=-1:
        newSche = capstoneInitial(newSche,CapstoneNum)
    Classlist=newClassList(seniorCourse)
    for c in sor:
        
        count=c[1]
        #print(count)
        if courses[count].courseName=="01.400":
            continue
        i = courses[count].numSessions
        classlist= Classlist[count]
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
        if courses[i].courseName=="01.400":
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
    #print(newlis)
    return newlis
##checkScore: check for the score of the current Schedule
##output the index of the schedules with minimum score
def checkScore(rawSchedule):
    global proNum,cla,claNum
    minScore=[]
    for i in range(len(rawSchedule)):
        currentScore=0
        for time in range(95):
            if time in [13,24] or time in [70,85]:# dont need to check for hass
                continue
            summ=[]
            for row in range(cla,claNum):
                if type(rawSchedule[i][row][time])==str:
                    continue
                if rawSchedule[i][row][time]!=-1 and rawSchedule[i][row][time]!=-500 :
                    if (rawSchedule[i][row][time] not in summ):
                        summ.append(rawSchedule[i][row][time])
            #currentScore+=len(summ)        
            term4=0
            term6=0
            for course in summ:
                if courses[course//10].term in [4,5]:
                    term4+=1
                else:
                    term6+=1
            if (term4>0 and term6>0):
                currentScore+=term6
            
        minScore.append((currentScore,i))
    output=[]
    count=0
    #print(minScore)
    for i in sorted(minScore):
        output.append(i[1])
        count+=1
        if count==9:break
    return output,minScore[0][0]
#to save the top nine params
def saveParams(index,rawParams):
    params=[]
    for i in index:
        params.append(copy.deepcopy(rawParams[i]))
    return params
##mutation: input: a list of 10 indexes with minimum score
def mutation(lis,rawParams):    
    output=[]   
    for i in lis:
        for j in lis:
            newParams=[]
            for k in range(6):
                r=random.randint(0,1)
                if r==0:
                    newParams.append(rawParams[i][k])
                else:
                    newParams.append(rawParams[j][k])
            
            if (len(rawParams[i][6])<=4):
                
                newParams.append(rawParams[i][6])
            else:
                r=random.randint(0,len(rawParams[i][6])-1)

                jvalue=rawParams[j][6][r]
                newlist=copy.deepcopy(rawParams[i][6])
                newlist.remove(jvalue)
                newlist.insert(r,jvalue)
                newParams.append(newlist)
            output.append(newParams)
    return output
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
def intToString(num):
    s="1"
    if num==1:
        return s
    else:
        for i in range(num-1):
            s=s+","+str(i+2)
    return s

def formatOutput(schedule):
    global courses
    global rowRef,CapstoneNum
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
                        formatJson(str(courses[CapstoneNum].term),"Capstone","01.400",profName,profID,intToString(courses[CapstoneNum].classes),"Capstone",str(day+1),str(int(time)),str(int(time+5)))
                        time+=6
                    else:
                        courseNum=schedule[prof][realTime]//10
                        sessionNum=schedule[prof][realTime]%10
                        if courses[courseNum].sessions[sessionNum]["class_type"]=="Lecture":
                                
                            classNum=courses[courseNum].classes
                            classStr=intToString(courses[courseNum].classes)                            
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
                        formatJson(str(courses[courseNum].term),courses[courseNum].pillar,courses[courseNum].courseName,profName,
                                   profID,classStr,str(rowRef[roos].roomName),str(day+1),str(startTime),str(endTime))
                        time=endTime+1
                else:
                    time+=1
        prof+=1

"""
main function
"""
start = time.time()
courses,seniorCourse = readJson("https://api.myjson.com/bins/qdsqn")

#courses = readJson("https://api.myjson.com/bins/h2c9v")"https://api.myjson.com/bins/fv1pj"
start1 = time.time()
rowRef=referenceRows()
rowRef=initializeValue()


dayTime=[[0,12],[25,37],[38,47],[57,69],[76,85]]    #The available slots for every day

rawSchedules = []
rawParams=[]
lastTime=time.time()
currentTime=lastTime
for i in range(90):
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
        if (currentTime-lastTime>30):
            raise ValueError("First round  takes more than 30 seconds")

    rawSchedules.append(currentSchedule)
    rawParams.append([param1,param2,param3,param4,randBreak1,randBreak2,seniorCourse])

lastTime=time.time()
if (lastTime-start1>5*60):
    raise ValueError("First round takes more than 5 minutes in total")

currentTime=lastTime
index,score=checkScore(rawSchedules)
newlist=saveParams(index,rawSchedules)
newlist1=saveParams(index,rawParams)
rawParams=mutation(index,rawParams)

for i in range(5):
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
    if (i==4):
        break
    rawParams=mutation(index,newlist1)
    newlist1=saveParams(index,newlist1)
    newlist=saveParams(index,newlist)
    #print("at the loop no.: ",i,"Score is ",score)
    
formatOutput(rawSchedule[index[0]])

end=time.time()    
#print(end-start,end-start1)

#print(score)
            
    

     
