from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time

class NaviTest(unittest.TestCase):

    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--explicitly-allowed-ports=6666')
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)
        #login
        self.driver.get("http://localhost:4200/login")
    
        email = self.driver.find_element_by_id("email")
        email.send_keys("email@email.com")

        password = self.driver.find_element_by_id("password")
        password.send_keys("password")

        button = self.driver.find_element_by_tag_name("button").click()
        header = WebDriverWait(self.driver,10).until(
            EC.visibility_of_element_located((By.ID, 'logoutButton')))

    def test_direct_to_home(self):
        driver = self.driver
        driver.find_element_by_id("sbAnnouncements").click()
        header = driver.find_element_by_tag_name('h5')
        self.assertIn("Announcements", header.text)

    def test_direct_to_add_user(self):
        driver = self.driver
        driver.find_element_by_id("sbAddUser").click()
        header = driver.find_element_by_tag_name('h5')
        self.assertEqual("Create a new Administrator/Instructor", header.text)

    def test_direct_to_schedule(self):
        driver = self.driver
        driver.find_element_by_id("sbViewSchedules").click()
        header = driver.find_element_by_tag_name('h5')
        self.assertEqual("All Schedules", header.text)

    def test_direct_to_a_course(self):
        driver = self.driver
        driver.find_element_by_id("sbViewSchedules").click()
        driver.find_elements_by_tag_name("td")[2].click()
        header = driver.find_element_by_tag_name('h5')
        self.assertEqual("Courses under this Schedule", header.text)

    def test_direct_to_add_event(self):
        driver = self.driver
        driver.find_element_by_id("sbViewSchedules").click()
        schedules = driver.find_elements_by_tag_name('td')
        schedules[2].click()
        driver.find_element_by_id("eventFormTitle").click()
        header = driver.find_element_by_tag_name('h6')
        self.assertEqual("Event details", header.text)

    def test_direct_to_add_course(self):
        driver = self.driver
        driver.find_element_by_id("sbViewSchedules").click()
        driver.find_elements_by_tag_name("td")[2].click()
        header = driver.find_element_by_id("courseFormTitle")
        self.assertEqual("Add a Course", header.text)

    # should default back to home page with announcements
    def test_direct_to_login(self):
        driver = self.driver
        driver.get("http://localhost:4200/login")
        header = driver.find_element_by_tag_name('h5')
        self.assertIn("Announcements", header.text)

    def test_direct_to_view_calendar(self):
        driver = self.driver
        driver.find_element_by_id("sbViewCalendar").click()
        header = driver.find_element_by_tag_name("h2")
        self.assertIn("2018", header.text)

    def test_direct_to_change_password(self):
        driver = self.driver
        driver.find_element_by_id("sbChangePassword").click()
        header = driver.find_element_by_tag_name("h5")
        self.assertIn("Change Password", header.text)

    def test_direct_to_view_appeals(self):
        driver = self.driver
        driver.find_element_by_id("sbViewAppeals").click()
        header = driver.find_element_by_tag_name("h2")
        self.assertIn("Appeals", header.text)

    def test_logout(self):
        driver = self.driver
        logoutbutton = driver.find_element_by_id("logoutButton").click()
        header = driver.find_element_by_tag_name("h1")
        self.assertIn("Login to Se7enScheduler", header.text)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()