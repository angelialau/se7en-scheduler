import json
import requests
import sys

jsonFile = sys.argv[1]
with open(jsonFile, 'r') as myfile:
    data=myfile.read().encode('ascii', 'ignore')

rafaelaCourses = json.loads(data.decode('ascii'))

endpoint = "http://devostrum.no-ip.info:6666/Courses"
newCourse = {"schedule_id":46}

for entry in rafaelaCourses:
	newCourse["term"] = entry["term"]
	newCourse["course_no"] = entry["course_no"]
	newCourse["course_name"] = entry["course_name"]
	newCourse["core"] = entry["core"]
	newCourse["no_classes"] = entry["no_classes"]
	newCourse["class_size"] = entry["class_size"]
	newCourse["no_sessions"] = entry["no_sessions"]
	newCourse["pillar"] = entry["pillar"]

	sessions_hrs = []
	class_types = []
	instructors = []
	instructor_ids = []
	split = []
	venue_types = []

	for session in entry["sessions"]:
		sessions_hrs.append(session["time"])
		class_types.append(session["class_type"])
		instructors.append(",".join(session["instructors"]))
		instructor_ids.append(",".join(session["instructor_ids"]))
		venue_types.append(session["preference"])
		split.append("1")

	newCourse["sessions_hrs"] = ",".join(sessions_hrs)
	newCourse["class_types"] = ",".join(class_types)
	newCourse["instructors"] = "|".join(instructors)
	newCourse["instructor_ids"] = "|".join(instructor_ids)
	newCourse["venue_types"] = ",".join(venue_types)
	newCourse["split"] = ",".join(split)
	r = requests.post(endpoint, data = newCourse)
	print(r.status_code, r.reason)
