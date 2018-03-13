# -*- coding: utf-8 -*-
"""
Created on Wed Feb 21 23:00:12 2018

@author: Rafaela
"""
from time import sleep
def timetableInitial():
    schedule = []
    for i in range(5):
        inter=[]
        for i in range(19):
            inter.append(0)
        schedule.append(inter)
    return schedule
def getSchedule(obj,day,i,j):
    for c in range(i,j+1):
        if obj.schedule[day][c]==1: 
            return False
    return True
class Course(object):
    def __init__(self,name,string,num_of_sessions,term,classes):
        self.courseName = name
        self.courseType = string
        self.numSessions = num_of_sessions
        self.term=term
        self.sessions=[[],[]]
        self.instructors=[]
        self.rooms=[]
        self.classes=classes
        self.priority = 0
        self.finish=False
    def setInstructors(self,ins):    
        self.instructors=ins
    def setRoom(self,ins):
        self.rooms=ins
    def setSessions(self,strType,length):
        self.sessions[0].append(strType)
        self.sessions[1].append(length)
#    def setClasses(self,classes):
#        self.classes = classes
    def setPriority(self,c1,c2,c3,c4):
        if self.courseType=="core": 
            j=2
        else:
            j=1
        if "Lecture" in self.sessions[0]: 
            lec = 1
        else:
            lec = 0
        self.priority= j*c1+self.numSessions*c2+len(self.classes)*c3+lec*c4
class Instructor(object):
    def __init__(self,name,courses):
        self.name = name
        self.courses=courses
        self.schedule=timetableInitial()
    def setSchedule(self,day,i,j):
        for c in range(i,j):
            self.schedule[day][c]=1

class CohortClass(object):
    def __init__(self,num_of_student,courselist):
        self.studentNumber = num_of_student
        self.courselist = courselist
        self.schedule = timetableInitial()
    def setSchedule(self,day,i,j):
        for c in range(i,j):
            self.schedule[day][c]=1
class Room(object):
    def __init__(self,roomName,roomType,maxNum):
        self.name = roomName
        self.type = roomType
        self.maxNum = maxNum
        self.schedule = timetableInitial()
    def setSchedule(self,day,i,j):
        for c in range(i,j):
            self.schedule[day][c]=1
def readJson():
    pass
def generator():
    pass
def writeJson():
    pass
    
    
#feed data as 50.001,50.004, four classes
classes=[]
classes.append(CohortClass(50,["50.001","50.004","50.002"]))
classes.append(CohortClass(50,["50.001","50.004","50.002"]))
classes.append(CohortClass(50,["50.001","50.004","50.002"]))

cohortRooms=[]
lectureTheatres=[]
thinkTanks=[]
cohortRooms.append(Room("Cohort Classroom 13","CC",60))
cohortRooms.append(Room("Cohort Classroom 14","CC",60))
thinkTanks.append(Room("Think Tank 10","TT",30))
lectureTheatres.append(Room("Lecture Theatre 2","LT",300))
## use LT extends rooms; cohort extends rooms for higher efficiency
instructors=[]
instructors.append(Instructor("Jit",["50.001"]))    
instructors.append(Instructor("Norman",["50.001"]))
instructors.append(Instructor("Simon",["50.004"]))
instructors.append(Instructor("Datta",["50.004"]))
instructors.append(Instructor("Oka",["50.002"]))

courses=[]
courses.append(Course("50.001","core",3,4,[0,1,2]))
courses[0].setInstructors([0,1])
courses[0].setSessions("CBL",1.5)
courses[0].setSessions("CBL",1.5)
courses[0].setSessions("CBL",1.5)
courses.append(Course("50.004","core",2,4,[0,1,2]))
courses[1].setInstructors([2,3])
courses[1].setSessions("Lecture",3)
courses[1].setSessions("CBL",2)
courses.append(Course("50.002","core",3,4,[0,1,2]))
courses[2].setInstructors([4])
courses[2].setSessions("CBL",1.5)
courses[2].setSessions("CBL",1.5)
courses[2].setSessions("CBL",2)
#algo
#step 1 set priority
for i in courses:
    i.setPriority(1,2,4,3)
for i in range(len(courses)):
    for j in range(len(courses)-1):
        if courses[j].priority<courses[j+1].priority:
            inter=courses[j]
            courses[j]=courses[j+1]
            courses[j+1]=inter
            #print(courses[j].instructors, "+++++", courses[j+1].instructors)
count=0
seed=0
output=""
while count<len(courses):
    i = courses[count].numSessions
    days=[0,0,0]
    time=[0,0,0]
    for l in range(i):
        
        if courses[count].sessions[0][l]=="CBL":
            
            classlist= courses[count].classes
            c1=0
            while (days[c1]<=4 and time[c1]<=19 and c1<len(classlist)):
        ## now dont have checking if the first session is there or not
        ## also dont have lunch time check
                boolean1=True
                boolean2=True
                for j in courses[count].instructors:
                    #print(count,j,c1,instructors[j].name,days[c1],time[c1],sum(instructors[j].schedule[days[c1]][time[c1]:int(time[c1]+courses[count].sessions[1][l]*2)]))
                    if sum(instructors[j].schedule[days[c1]][time[c1]:int(time[c1]+courses[count].sessions[1][l]*2)]) !=0:
                        boolean1=False
                        break
                if boolean1 and sum(classes[classlist[c1]].schedule[days[c1]][time[c1]:int(time[c1]+courses[count].sessions[1][l]*2)])==0:
                   
                    for k in range(len(cohortRooms)):
                        if sum(cohortRooms[k].schedule[days[c1]][time[c1]:int(time[c1]+courses[count].sessions[1][l]*2)]) ==0:
                            for j in courses[count].instructors:
                                instructors[j].setSchedule(days[c1],time[c1],int(time[c1]+courses[count].sessions[1][l]*2))
                            classes[classlist[c1]].setSchedule(days[c1],time[c1],int(time[c1]+courses[count].sessions[1][l]*2))
                            cohortRooms[k].setSchedule(days[c1],time[c1],int(time[c1]+courses[count].sessions[1][l]*2))
                            output+="Class "+str(c1+1)+" have "+courses[count].courseName+" from "+str(time[c1])+" to "+str(int(time[c1]+courses[count].sessions[1][l]*2))+" on Day "+str(days[c1])+" in "+cohortRooms[k].name+"\n"
                            boolean2=False
                            days[c1]+=1
                            time[c1]=0
                            c1+=1
                            break
                if c1==len(classlist):
                    break
                if boolean2==True:
                    time[c1]+=1
                    if time[c1]==12:
                        time[c1]=0
                        days[c1]+=1
            if(c1!=len(classlist)):
                print("conflict at CBL")
                sleep(100)
                break
        elif courses[count].sessions[0][l]=="Lecture":
            maxi=0
            for j in courses[count].classes:
                if days[j]*24+time[j]>maxi:
                    maxi=days[j]*24+time[j]
            for j in courses[count].classes:
                days[j]=maxi//24
                time[j]=maxi%24
            while (days[0]<=4 and time[0]<=19):
                boolean1 = True
                for j in courses[count].classes:
                    if sum(classes[j].schedule[days[0]][time[0]:int(time[0]+courses[count].sessions[1][l]*2)]) !=0:
                        boolean1=False    
                        break
                if boolean1:
                    for j in courses[count].instructors:
                        if sum(instructors[j].schedule[days[0]][time[0]:int(time[0]+courses[count].sessions[1][l]*2)]) !=0:
                            boolean1=False
                            break
                    if boolean1:
                        for k in range(len(lectureTheatres)):
                            if sum(lectureTheatres[k].schedule[days[0]][time[0]:int(time[0]+courses[count].sessions[1][l]*2)]) ==0:
                                for j in courses[count].classes:
                                    classes[j].setSchedule(days[0],time[0],int(time[0]+courses[count].sessions[1][l]*2))
                                    output+="Class "+str(j+1)+" have "+courses[count].courseName+" from "+str(time[0])+" to "+str(int(time[0]+courses[count].sessions[1][l]*2))+" on Day "+str(days[0])+" in "+lectureTheatres[k].name+"\n"
                                    
                                for j in courses[count].instructors:
                                    instructors[j].setSchedule(days[0],time[0],int(time[0]+courses[count].sessions[1][l]*2))
                                for j in courses[count].classes:
                                    days[j]+=1
                                    time[j]=0
                                lectureTheatres[k].setSchedule(days[0],time[0],int(time[0]+courses[count].sessions[1][l]*2))
                                break
                        break
                else:
                    time[0]+=1
                    if time[0]>12:
                        time[0]=0
                        days[0]+=1
            if not(boolean1):
                print("conflict")
                sleep(100)
                break
    count+=1

print(output)            
                    
            
    

     
