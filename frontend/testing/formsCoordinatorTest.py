from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time, pickle

preButtonError = "submit button should be disabled before form is filled"
postButtonError = "submit button should be enabled after form is filled"
formResetError = "form input fields did not revert to ng-pristine after refreshing"

def broken_function():
    raise Exception('This is broken')

class FormsCoordinatorTest(unittest.TestCase):

    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--explicitly-allowed-ports=6666')
        self.driver = webdriver.Chrome(options=chrome_options)
        # login
        self.driver.implicitly_wait(10)
        self.driver.get("http://localhost:4200/login")
    
        email = self.driver.find_element_by_id("email")
        email.send_keys("email@email.com")

        password = self.driver.find_element_by_id("password")
        password.send_keys("password")

        button = self.driver.find_element_by_tag_name("button").click() 
        header = WebDriverWait(self.driver,10).until(
            EC.visibility_of_element_located((By.ID, 'logoutButton')))

    def test_make_announcement(self):
        driver = self.driver
        driver.find_element_by_id("makeAnnouncementBtn").click()
        header = driver.find_element_by_tag_name('h5')
        self.assertIn("Make an Announcement", header.text)
        
        submit = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "announcementButton")))
        self.assertEqual(submit.is_enabled(), False, preButtonError)

        title = driver.find_element_by_id("title")
        title.send_keys("Test Announcement")

        content = driver.find_element_by_id("announcementContent")
        content.send_keys("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus. Diam maecenas sed enim ut. Pulvinar etiam non quam lacus suspendisse. Quis varius quam quisque id diam. Ultricies mi quis hendrerit dolor magna eget est lorem ipsum. Augue ut lectus arcu bibendum at varius vel. Diam sollicitudin tempor id eu nisl nunc. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Et tortor consequat id porta nibh venenatis cras. Risus in hendrerit gravida rutrum quisque. Morbi tristique senectus et netus. Nam libero justo laoreet sit. Diam donec adipiscing tristique risus. Maecenas accumsan lacus vel facilisis. Viverra aliquet eget sit amet tellus cras. Nunc sed velit dignissim sodales ut eu sem integer vitae. Non blandit massa enim nec dui nunc mattis. Viverra nibh cras pulvinar mattis nunc.")

        submit = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "announcementButton")))
        self.assertEqual(submit.is_enabled(), True, postButtonError)


    def test_add_user(self):
        driver = self.driver
        driver.get("http://localhost:4200/user")
        button = driver.find_element_by_id("sbAddUser").click() #move to navigation test
        
        submit = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'submitFormButton')))
        self.assertEqual(submit.is_enabled(), False, preButtonError)

        select = driver.find_element_by_id("pillar")
        options = select.find_elements_by_tag_name("option")
        for option in options:
            if(option.text=="ISTD"):
                option.click()
                break
        name = driver.find_element_by_id("name")
        name.send_keys("Add User Selenium Test")

        email = driver.find_element_by_id("email")
        email.send_keys("selenium@sutd.edu.sg")

        phone = driver.find_element_by_id("phone")
        phone.send_keys("63036662")

        password = driver.find_element_by_id("password")
        password.send_keys("password")

        submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'submitFormButton')))
        self.assertEqual(submit.is_enabled(), True, postButtonError)

    def test_add_schedule(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules")

        div = driver.find_element_by_id("scheduleFormTitle").click()

        trimester = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "trimester")))
        trimesteroptions = trimester.find_elements_by_tag_name("option")
        for option in trimesteroptions:
            if "Trimester 3" in option.text:
                option.click()

        year = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "year")))
        yearoptions = year.find_elements_by_tag_name("option")
        for option in yearoptions:
            if "2023" in option.text:
                option.click()

        start = driver.find_element_by_id('start')
        start.send_keys('2018-11-12')

        end = driver.find_element_by_id('end')
        end.send_keys('2018-11-13')

        submit = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "addScheduleSubmitButton")))
        self.assertEqual(submit.is_enabled(), True, "add schedule form button not enabled")

        #test reset function
        driver.find_element_by_id("addSchedResetButton").click()
        #check that input fields revert to the pristine state
        trimester = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "trimester")))
        self.assertEqual("ng-pristine" in trimester.get_attribute("class"), True, formResetError) 

    def test_add_course(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules/45")
        header = driver.find_elements_by_id("courseFormTitle")
        self.assertEqual(len(header), 1)

        submit = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'addCourseSubmitButton')))
        self.assertEqual(submit.is_enabled(), False, preButtonError)

        select = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.ID,"courseDetail")))
        options = select.find_elements_by_tag_name("option")
        for option in options:
            if(option.text.strip()=="EPD Term 7 - 30.114 Advanced Feedback and Control"):
                option.click()
                break
        
        core = driver.find_element_by_id("core")
        core.click()

        no_classes = driver.find_element_by_id("no_classes")
        no_classesOptions = no_classes.find_elements_by_tag_name("option")
        for option in no_classesOptions:
            if(option.text.strip()=="4"):
                option.click()
                break

        class_size = driver.find_element_by_id("class_size")
        class_sizeOptions = class_size.find_elements_by_tag_name("option")
        for option in class_sizeOptions:
            if(option.text.strip()=="3"):
                option.click()
                break
        
        prof1 = driver.find_element_by_xpath('//select[@formcontrolname="id"]')
        prof1options = prof1.find_elements_by_tag_name("option")
        for option in prof1options:
            if "ISTD - Oka Kurniawan" in option.text:
                option.click()

        class_types = driver.find_element_by_xpath('//select[@formcontrolname="class_types"]')
        class_typesoptions = class_types.find_elements_by_tag_name("option")
        for option in class_typesoptions:
            if "Cohort Based Learning" in option.text:
                option.click()  

        venue_types = driver.find_element_by_xpath('//select[@formcontrolname="venue_types"]')
        venue_typesoptions = class_types.find_elements_by_tag_name("option")
        for option in venue_typesoptions:
            if "Tiered Think Tank" in option.text:
                option.click()  

        sessions_hrs = driver.find_element_by_xpath('//select[@formcontrolname="sessions_hrs"]')
        sessions_hrsoptions = sessions_hrs.find_elements_by_tag_name("option")
        for option in sessions_hrsoptions:
            if "2.5" in option.text:
                option.click()    

        checkbox = driver.find_element_by_id("checkbox")
        checkbox.click()

        submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'addCourseSubmitButton')))
        self.assertEqual(submit.is_enabled(), True, postButtonError)

        driver.find_element_by_id("resetCourseButton").click()
        dropdown = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'courseDetail')))
        self.assertEqual("ng-pristine" in dropdown.get_attribute("class"), True, formResetError) 

    # def test_change_password(self):
    #     driver = self.driver
    #     driver.get('http://localhost:4200/password')

    #     submit = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'submitChangePasswordFormButton')))
    #     self.assertEqual(submit.is_enabled(), False, preButtonError)

    #     oldP = driver.find_element_by_id('oldPassword')
    #     oldP.send_keys('password')

    #     newP = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'newPassword'))) 
    #     newP.send_keys('newpassword')

    #     confirmP = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'confirmPassword'))) 
    #     confirmP.send_keys('newpassword') 

    #     submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'submitChangePasswordFormButton')))
    #     self.assertEqual(submit.is_enabled(), True, postButtonError)
    
    def test_add_event(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules/31")
        header = driver.find_elements_by_id("schedulesTitle")
        self.assertEqual(len(header), 1)

        submit = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'submitEventButton')))
        self.assertEqual(submit.is_enabled(), False, preButtonError)

        select = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.ID,"location")))
        options = select.find_elements_by_tag_name("option")
        for option in options:
            if(option.text.strip()=="Think Tank 1"):
                option.click()
                break
        
        course = driver.find_element_by_id("course")
        course.send_keys("Blockchain Seminar 2018")

        instructorId = driver.find_element_by_id("instructorId")
        instructorIdOptions = instructorId.find_elements_by_tag_name("option")
        instructorIdOptions[0].click()

        pillar = driver.find_element_by_id("pillar")
        pillarOptions = pillar.find_elements_by_tag_name("option")
        pillarOptions[0].click()

        cohort = driver.find_element_by_id("cohort")
        cohortOptions = cohort.find_elements_by_tag_name("option")
        cohortOptions[0].click()

        submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'submitEventButton')))
        self.assertEqual(submit.is_enabled(), True, postButtonError)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()