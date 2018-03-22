# -*- coding: utf-8 -*-
"""
Created on Wed Mar 14 04:33:37 2018

@author: trying
"""


import json
from urllib.request import urlopen
import random
import copy
import time
import operator

def readJson(url):
    weather = urlopen(url)
    wjson = json.load(weather)
    courses=[]
    i=0
    for key,value in wjson.items():
        courses.append(Course(value["course_no"],value["core"],len(value["sessions"]),value["term"],value["no_classes"],value["class_size"]))
        courses[i].sessions=value["sessions"]
        i+=1
    return courses
def referenceRows():
    row=[]
    for i in range(26):
        row.append("Think Tank "+str(i+1))
    for i in range(16):
        row.append("Cohort Classroom "+str(i+1))
    for i in range(5):
        row.append("Lecture Theatre "+str(i+1))
    for i in range(47,249):
        row.append("")      #cohort classes and professors
    return row
"""
the rows:
think tank: 0-25 (26)
CC: 26-41 (16)
LT: 42-46 (5)
Class: 50-99 (50)
Prof: 100-249 (150) 


"""
def initializeValue():                      #initialize rooms, cohort list, professor list
    global proNum
    global claNum
    rowRef=referenceRows()
    
    for course in courses:
        if course.term in [4,5]:
            if course.courseName[0]=="5":
                course.setRoom([cc+12,cc+13,lt+1,lt+2])
                classlist=[]
                for k in range(course.classes):
                    rowRef[cla+k]="ISTD term "+str(course.term)+" Cohort "+str(k+1) 
                    classlist.append(cla+k)
                course.classlist=classlist
        if course.term in [6,7,8]:
            if course.courseName[0]=="5":
                course.setRoom([tt+15,tt+16,tt+17,cc+14,lt+1,lt+2])
                course.classlist=[]
                for k in range(course.classes):
                    rowRef[claNum]="ISTD term "+str(course.term)+" Cohort "+str(k+1) 
                    course.classlist.append(claNum)
                    claNum+=1
        for j in course.sessions:
            lis=[]
            for prof in j["professors"]:
                if prof not in rowRef:
                    rowRef[proNum]=prof
                    proNum+=1
                lis.append(rowRef.index(prof))
            j["proID"]=lis
    return rowRef

def timetableInitial(b1,b2):
    schedule = []
    temp=[]
    for i in range(5*19):
        temp.append(-1)
    temp[b1]=-500
    temp[b2]=-500
    for i in range(250):
        schedule.append(copy.deepcopy(temp))
    return schedule
def getSchedule(obj,day,i,j):
    for c in range(i,j):
        if obj.schedule[day][c]==1: 
            return False
    return True
class Course(object):
    def __init__(self,name,boolean,num_of_sessions,term,classes,studentSize):
        self.courseName = name
        self.courseType = boolean
        self.numSessions = num_of_sessions
        self.term=term
        self.sessions=[]
        self.rooms=[]
        self.classes=classes
        self.size=studentSize
        self.classlist=[]
        self.priority = 0
        self.finish=False
    def setInstructors(self,ins):    
        self.instructors=ins
    def setRoom(self,ins):
        self.rooms=ins
    def setPriority(self,c1,c2,c3,c4):
        if self.courseType: 
            j=2
        else:
            j=1
        lec = 0;
        for i in self.sessions:
            if i["location"]=="Lecture":
                lec+=1
        self.priority= j*c1+self.numSessions*c2+self.classes*c3+lec*c4
        
def generator(c1,c2,c3,c4,b1,b2):
    dayTime=[[0,12],[25,37],[38,47],[57,69],[76,81]]    #The available slots for every day
    sequence=[]
    for i in courses:
        i.setPriority(c1,c2,c3,c4)
    for i in range(len(courses)):
        sequence.append((courses[i].priority,i))
    sor=sorted(sequence)
    
#    for i in range(len(courses)):
#        for j in range(len(courses)-1):
#            if courses[j].priority<courses[j+1].priority:
#                inter=courses[j]
#                courses[j]=courses[j+1]
#                courses[j+1]=inter
#                
    newSche=timetableInitial(b1,b2)
#    while count<len(courses):
    for c in sor:
        count=c[1]
        i = courses[count].numSessions
        classlist= courses[count].classlist
        classRanCheck=[]
        
        for k in range(len(classlist)):
            classRanCheck.append(0)
        for l in range(i):
            clength=int(courses[count].sessions[l]["time"]*2)
            if courses[count].sessions[l]["location"]=="Cohort Based Learning":
                classCheck=copy.deepcopy(classlist)
                for num in range(len(classlist)):
                    randomClass=classCheck[random.randint(0,len(classCheck)-1)]
                    randomDay = classRanCheck[classlist.index(randomClass)]
                    while (True):
                        if randomDay>4:
                            newSche[0][0]="Fail"
                            return newSche
                        succ = False
                        for newtime in range(dayTime[randomDay][0],dayTime[randomDay][1]-clength+2):
                            if sum(newSche[randomClass][newtime:newtime+clength])!=-clength:
                                continue
                            else:
                                profC=True
                                for prof in courses[count].sessions[l]["proID"]:
                                    
                                    if sum(newSche[prof][newtime:newtime+clength])!=-clength:
                                        profC=False
                                        break
                                if profC:
                                    succ=False
                                    for room in courses[count].rooms:
                                        if room>=lt:
                                            continue
                                        elif not((room<cc and courses[count].size<=30)or room>=cc):
                                            continue
                                        elif sum(newSche[room][newtime:newtime+clength])==-clength:
                                            #print(rowRef[randomClass]+" have "+courses[count].courseName+" from "+str(newtime)+" to "+str(newtime+clength-1)+" on Day "+str(randomDay)+" in "+rowRef[room]+"\n")
                                            for t in range(newtime,newtime+clength):
                                                newSche[randomClass][t]=count
                                                newSche[room][t]=count
                                                for prof in courses[count].sessions[l]["proID"]:
                                                    newSche[prof][t]=count
                                            classCheck.remove(randomClass)
                                            classRanCheck[classlist.index(randomClass)]=randomDay+1
                                            succ=True
                                            break
                                    if succ:
                                        break
                        if succ:
                            break
                        randomDay+=1
            elif courses[count].sessions[l]["location"]=="Lecture":
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
                        check1=True
                        for randomClass in classlist:
                            if sum(newSche[randomClass][newtime:newtime+clength])!=-clength:
                                check1=False
                                break
                        if check1:
                            for prof in courses[count].sessions[l]["proID"]:
                                
                                if sum(newSche[prof][newtime:newtime+clength])!=-clength:
                                    check1=False
                                    break
                            if check1:
                                succ=False
                                for room in courses[count].rooms:
                                    
                                    if room<lt:
                                        continue
                                    elif sum(newSche[room][newtime:newtime+clength])==-clength:
                                        #print(rowRef[randomClass]+" have "+courses[count].courseName+" from "+str(newtime)+" to "+str(newtime+clength-1)+" on Day "+str(randomDay)+" in "+rowRef[room]+"\n")
                                        for t in range(newtime,newtime+clength):
                                            for randomClass in classlist:
                                                newSche[randomClass][t]=count
                                            newSche[room][t]=count
                                            for prof in courses[count].sessions[l]["proID"]:
                                                newSche[prof][t]=count
                                        for randomClass in range(len(classlist)):
                                            classRanCheck[randomClass]=randomDay+1
                                        succ=True
                                        break
                        if succ:
                            break
                    if succ:
                        break
                    randomDay+=1
        count+=1
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
                if rawSchedules[i][row][time]!=-1 and rawSchedules[i][row][time]!=-500:
                    if (rawSchedules[i][row][time] not in summ):
                        summ.append(rawSchedules[i][row][time])
            currentScore+=len(summ)        
            for course in summ:
                if courses[course].term in [4,5]:
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
        print(rowRef[prof],":")
        for day in range(5):
            time=0
            while (time<19):
                if schedule[prof][day*19+time]!=-1 and schedule[prof][day*19+time]!=-500:
                    clas=cla
                    while (schedule[clas][day*19+time]!=schedule[prof][day*19+time]):
                        clas+=1
                    for room in courses[schedule[prof][day*19+time]].rooms:
                        if schedule[clas][day*19+time]==schedule[room][day*19+time]:
                            roos=room
                            break
                    startTime=time
                    while (True):
                        time+=1
                        if time==19:
                            break
                        if (schedule[prof][day*19+time]!=schedule[prof][day*19+startTime]):
                            break
                        if (schedule[clas][day*19+time]!=schedule[clas][day*19+startTime]):
                            break
                        if (schedule[roos][day*19+time]!=schedule[roos][day*19+startTime]):
                            break
                    endTime=time-1
                    print(courses[schedule[prof][day*19+endTime]].courseName+"--",rowRef[clas],"--",rowRef[roos],"-- on Day",day+1,"from",startTime,"to",endTime)
                else:
                    time+=1
            
        
        prof+=1

"""
main function
"""
start = time.time()
courses = readJson("https://api.myjson.com/bins/g4sxp")
start1 = time.time()
rowRef=referenceRows()
rowRef=initializeValue()
tt,cc,lt,cla,pro=0,26,42,50,100

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
        currentSchedule=generator(param1,param2,param3,param4,randBreak1,randBreak2)
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
            currentSchedule=generator(rawParams[j][0],rawParams[j][1],rawParams[j][2],rawParams[j][3],rawParams[j][4],rawParams[j][5])
            if currentSchedule[0][0]!="Fail":
                break
        rawSchedule.append(currentSchedule)
    print("at the loop no.: ",i,"Score is ",score)
index,score=checkScore()
formatOutput(rawSchedule[index[0]])

end=time.time()    
print(end-start,end-start1)

print(score)
            
    

     
